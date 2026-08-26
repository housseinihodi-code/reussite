import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, VehicleStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    const vehicleIds = dto.items.map((item) => item.vehicleId);
    const vehicles = await this.prisma.vehicle.findMany({
      where: { id: { in: vehicleIds }, status: VehicleStatus.PUBLISHED },
    });
    if (vehicles.length !== vehicleIds.length) {
      throw new BadRequestException("Un ou plusieurs véhicules ne sont plus disponibles.");
    }

    const subtotal = vehicles.reduce((sum, v) => sum + v.price, 0);
    const taxAmount = Math.round(subtotal * 0.2 * 100) / 100;
    const totalAmount = subtotal + taxAmount;

    // Vehicles are only marked SOLD once payment actually succeeds (see
    // PaymentsService) — not here — so an order that never gets paid doesn't
    // permanently lock a vehicle out of the catalogue.
    return this.prisma.order.create({
      data: {
        orderNumber: `CM-${nanoid(10).toUpperCase()}`,
        buyerId,
        subtotal,
        taxAmount,
        totalAmount,
        billingAddressId: dto.billingAddressId,
        shippingAddressId: dto.shippingAddressId,
        notes: dto.notes,
        items: {
          create: vehicles.map((v) => ({
            vehicleId: v.id,
            unitPrice: v.price,
            totalPrice: v.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  findAllForBuyer(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: { items: { include: { vehicle: { include: { images: true } } } }, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { items: true, payments: true, buyer: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, requesterId: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { vehicle: { include: { images: true } } } }, payments: true },
    });
    if (!order) throw new NotFoundException('Commande introuvable.');
    if (!isAdmin && order.buyerId !== requesterId) throw new ForbiddenException();
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Commande introuvable.');
    return this.prisma.order.update({ where: { id }, data: { status: dto.status as OrderStatus } });
  }
}
