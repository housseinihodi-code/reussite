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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findPendingVehicles() {
        return this.prisma.vehicle.findMany({
            where: { status: client_1.VehicleStatus.PENDING_REVIEW },
            include: { images: true, brand: true, model: true, seller: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async approveVehicle(id) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        return this.prisma.vehicle.update({ where: { id }, data: { status: client_1.VehicleStatus.PUBLISHED } });
    }
    async rejectVehicle(id) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        return this.prisma.vehicle.update({ where: { id }, data: { status: client_1.VehicleStatus.REJECTED } });
    }
    async assignRole(userId, roleName) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable.');
        const role = await this.prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, description: roleName },
        });
        if (user.roles.some((r) => r.id === role.id))
            return user;
        return this.prisma.user.update({
            where: { id: userId },
            data: { roleIds: { push: role.id } },
            include: { roles: true },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map