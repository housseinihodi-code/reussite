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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ImagesService = class ImagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertOwnership(vehicleId, sellerId) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        if (vehicle.sellerId !== sellerId)
            throw new common_1.ForbiddenException();
        return vehicle;
    }
    async add(sellerId, dto) {
        await this.assertOwnership(dto.vehicleId, sellerId);
        const count = await this.prisma.vehicleImage.count({ where: { vehicleId: dto.vehicleId } });
        return this.prisma.vehicleImage.create({
            data: { ...dto, position: count, isPrimary: count === 0 },
        });
    }
    async remove(id, sellerId) {
        const image = await this.prisma.vehicleImage.findUnique({ where: { id } });
        if (!image)
            throw new common_1.NotFoundException('Image introuvable.');
        await this.assertOwnership(image.vehicleId, sellerId);
        return this.prisma.vehicleImage.delete({ where: { id } });
    }
    async setPrimary(id, sellerId) {
        const image = await this.prisma.vehicleImage.findUnique({ where: { id } });
        if (!image)
            throw new common_1.NotFoundException('Image introuvable.');
        await this.assertOwnership(image.vehicleId, sellerId);
        await this.prisma.vehicleImage.updateMany({
            where: { vehicleId: image.vehicleId },
            data: { isPrimary: false },
        });
        return this.prisma.vehicleImage.update({ where: { id }, data: { isPrimary: true } });
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagesService);
//# sourceMappingURL=images.service.js.map