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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, dto) {
        const existing = await this.prisma.review.findUnique({
            where: { vehicleId_authorId: { vehicleId: dto.vehicleId, authorId } },
        });
        if (existing)
            throw new common_1.ConflictException('Vous avez déjà laissé un avis pour ce véhicule.');
        const review = await this.prisma.review.create({
            data: { ...dto, authorId },
            include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        });
        await this.recomputeVehicleRating(dto.vehicleId);
        return review;
    }
    findByVehicle(vehicleId) {
        return this.prisma.review.findMany({
            where: { vehicleId },
            include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id, authorId) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review || review.authorId !== authorId)
            throw new common_1.NotFoundException('Avis introuvable.');
        await this.prisma.review.delete({ where: { id } });
        await this.recomputeVehicleRating(review.vehicleId);
        return { message: 'Avis supprimé.' };
    }
    async recomputeVehicleRating(vehicleId) {
        const aggregate = await this.prisma.review.aggregate({
            where: { vehicleId },
            _avg: { rating: true },
            _count: true,
        });
        await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                averageRating: aggregate._avg.rating ?? 0,
                reviewsCount: aggregate._count,
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map