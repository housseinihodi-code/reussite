import { PrismaService } from '@/prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sellerStats(sellerId: string): Promise<{
        totalListings: number;
        publishedListings: number;
        soldListings: number;
        totalViews: number;
        averageRating: number;
    }>;
    adminStats(): Promise<{
        totalUsers: number;
        totalVehicles: number;
        totalOrders: number;
        totalRevenue: number;
        pendingReview: number;
    }>;
}
