import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleName, VehicleStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  findPendingVehicles() {
    return this.prisma.vehicle.findMany({
      where: { status: VehicleStatus.PENDING_REVIEW },
      include: { images: true, brand: true, model: true, seller: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveVehicle(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');
    return this.prisma.vehicle.update({ where: { id }, data: { status: VehicleStatus.PUBLISHED } });
  }

  async rejectVehicle(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');
    return this.prisma.vehicle.update({ where: { id }, data: { status: VehicleStatus.REJECTED } });
  }

  async assignRole(userId: string, roleName: RoleName) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const role = await this.prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: roleName },
    });

    if (user.roles.some((r) => r.id === role.id)) return user;

    return this.prisma.user.update({
      where: { id: userId },
      data: { roleIds: { push: role.id } },
      include: { roles: true },
    });
  }
}
