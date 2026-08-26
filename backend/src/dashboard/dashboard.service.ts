import { Injectable } from '@nestjs/common';
import { OrderStatus, VehicleStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async sellerStats(sellerId: string) {
    const [totalListings, publishedListings, soldListings, totalViews, ratingAgg] = await Promise.all([
      this.prisma.vehicle.count({ where: { sellerId } }),
      this.prisma.vehicle.count({ where: { sellerId, status: VehicleStatus.PUBLISHED } }),
      this.prisma.vehicle.count({ where: { sellerId, status: VehicleStatus.SOLD } }),
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
      this.prisma.order.aggregate({ where: { status: OrderStatus.PAID }, _sum: { totalAmount: true } }),
      this.prisma.vehicle.count({ where: { status: VehicleStatus.PENDING_REVIEW } }),
    ]);

    return {
      totalUsers,
      totalVehicles,
      totalOrders,
      totalRevenue: revenueAgg._sum.totalAmount ?? 0,
      pendingReview,
    };
  }
}
