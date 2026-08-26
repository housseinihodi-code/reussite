"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(buyerId, dto) {
        const vehicleIds = dto.items.map((item) => item.vehicleId);
        const vehicles = await this.prisma.vehicle.findMany({
            where: { id: { in: vehicleIds }, status: client_1.VehicleStatus.PUBLISHED },
        });
        if (vehicles.length !== vehicleIds.length) {
            throw new common_1.BadRequestException("Un ou plusieurs véhicules ne sont plus disponibles.");
        }
        const subtotal = vehicles.reduce((sum, v) => sum + v.price, 0);
        const taxAmount = Math.round(subtotal * 0.2 * 100) / 100;
        const totalAmount = subtotal + taxAmount;
        return this.prisma.order.create({
            data: {
                orderNumber: `CM-${(0, nanoid_1.nanoid)(10).toUpperCase()}`,
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
    findAllForBuyer(buyerId) {
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
    async findOne(id, requesterId, isAdmin = false) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { vehicle: { include: { images: true } } } }, payments: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable.');
        if (!isAdmin && order.buyerId !== requesterId)
            throw new common_1.ForbiddenException();
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable.');
        return this.prisma.order.update({ where: { id }, data: { status: dto.status } });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map