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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
const prisma_service_1 = require("../prisma/prisma.service");
const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g');
const slugify = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
let VehiclesService = class VehiclesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertVinAvailable(vin, excludeId) {
        if (!vin)
            return;
        const existing = await this.prisma.vehicle.findFirst({ where: { vin } });
        if (existing && existing.id !== excludeId) {
            throw new common_1.ConflictException('Ce numéro VIN est déjà utilisé par une autre annonce.');
        }
    }
    async create(sellerId, dto, isAdmin = false) {
        await this.assertVinAvailable(dto.vin);
        const { imageUrls, ...data } = dto;
        const slug = `${slugify(dto.title)}-${(0, nanoid_1.nanoid)(6)}`;
        return this.prisma.vehicle.create({
            data: {
                ...data,
                slug,
                sellerId,
                status: isAdmin ? client_1.VehicleStatus.PUBLISHED : client_1.VehicleStatus.PENDING_REVIEW,
                images: imageUrls?.length
                    ? {
                        create: imageUrls.map((url, index) => ({
                            url,
                            position: index,
                            isPrimary: index === 0,
                        })),
                    }
                    : undefined,
            },
            include: { images: true, brand: true, model: true, category: true },
        });
    }
    async findAll(query) {
        const where = {
            status: client_1.VehicleStatus.PUBLISHED,
            ...(query.brandId && { brandId: query.brandId }),
            ...(query.modelId && { modelId: query.modelId }),
            ...(query.categoryId && { categoryId: query.categoryId }),
            ...(query.country && { country: query.country }),
            ...(query.fuelType && { fuelType: query.fuelType }),
            ...(query.transmission && { transmission: query.transmission }),
            ...(query.condition && { condition: query.condition }),
            ...(query.maxMileage && { mileage: { lte: query.maxMileage } }),
            ...((query.minPrice || query.maxPrice) && {
                price: { gte: query.minPrice ?? 0, lte: query.maxPrice ?? Number.MAX_SAFE_INTEGER },
            }),
            ...((query.minYear || query.maxYear) && {
                year: { gte: query.minYear ?? 1900, lte: query.maxYear ?? new Date().getFullYear() + 1 },
            }),
            ...(query.q && {
                OR: [
                    { title: { contains: query.q, mode: 'insensitive' } },
                    { description: { contains: query.q, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.vehicle.findMany({
                where,
                skip: query.skip,
                take: query.limit,
                orderBy: { [query.sortBy ?? 'createdAt']: query.order ?? 'desc' },
                include: { images: true, brand: true, model: true, category: true },
            }),
            this.prisma.vehicle.count({ where }),
        ]);
        return {
            data,
            meta: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    }
    async findBySlug(slug) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { slug },
            include: {
                images: { orderBy: { position: 'asc' } },
                brand: true,
                model: true,
                category: true,
                seller: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, country: true } },
                reviews: { include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
            },
        });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        await this.prisma.vehicle.update({
            where: { id: vehicle.id },
            data: { viewsCount: { increment: 1 } },
        });
        return vehicle;
    }
    async update(id, sellerId, dto, isAdmin = false) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        if (!isAdmin && vehicle.sellerId !== sellerId) {
            throw new common_1.ForbiddenException("Vous ne pouvez modifier que vos propres annonces.");
        }
        await this.assertVinAvailable(dto.vin, id);
        const { imageUrls, ...data } = dto;
        return this.prisma.vehicle.update({ where: { id }, data });
    }
    async remove(id, sellerId, isAdmin = false) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Véhicule introuvable.');
        if (!isAdmin && vehicle.sellerId !== sellerId) {
            throw new common_1.ForbiddenException("Vous ne pouvez supprimer que vos propres annonces.");
        }
        return this.prisma.vehicle.update({ where: { id }, data: { status: client_1.VehicleStatus.ARCHIVED } });
    }
    findBySeller(sellerId) {
        return this.prisma.vehicle.findMany({
            where: { sellerId },
            include: { images: true, brand: true, model: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map