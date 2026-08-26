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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sellerStats(sellerId) {
        const [totalListings, publishedListings, soldListings, totalViews, ratingAgg] = await Promise.all([
            this.prisma.vehicle.count({ where: { sellerId } }),
            this.prisma.vehicle.count({ where: { sellerId, status: client_1.VehicleStatus.PUBLISHED } }),
            this.prisma.vehicle.count({ where: { sellerId, status: client_1.VehicleStatus.SOLD } }),
            this.prisma.vehicle.aggregate({ where: { sellerId }, _sum: { viewsCount: true } }),
            this.prisma.vehicle.aggregate({ where: { sellerId }, _avg: { averageRating: true } }),
        ]);
        return {
            totalListings,
            publishedListings,
            soldListings,
            totalViews: totalViews._sum.viewsCount ?? 0,
            averageRating: ratingAgg._avg.averageRating ?? 0,
        };
    }
    async adminStats() {
        const [totalUsers, totalVehicles, totalOrders, revenueAgg, pendingReview] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.vehicle.count(),
            this.prisma.order.count(),
            this.prisma.order.aggregate({ where: { status: client_1.OrderStatus.PAID }, _sum: { totalAmount: true } }),
            this.prisma.vehicle.count({ where: { status: client_1.VehicleStatus.PENDING_REVIEW } }),
        ]);
        return {
            totalUsers,
            totalVehicles,
            totalOrders,
            totalRevenue: revenueAgg._sum.totalAmount ?? 0,
            pendingReview,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map