import { DashboardService } from './dashboard.service';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    sellerStats(user: AuthenticatedUser): Promise<{
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
