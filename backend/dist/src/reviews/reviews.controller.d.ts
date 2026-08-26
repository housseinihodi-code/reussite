import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findByVehicle(vehicleId: string): import(".prisma/client").Prisma.PrismaPromise<({
        author: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: string;
        authorId: string;
        rating: number;
        comment: string | null;
        isVerifiedPurchase: boolean;
    })[]>;
    create(user: AuthenticatedUser, dto: CreateReviewDto): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: string;
        authorId: string;
        rating: number;
        comment: string | null;
        isVerifiedPurchase: boolean;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
