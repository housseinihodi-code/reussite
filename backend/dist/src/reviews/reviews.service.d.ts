import { PrismaService } from '@/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, dto: CreateReviewDto): Promise<{
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
    remove(id: string, authorId: string): Promise<{
        message: string;
    }>;
    private recomputeVehicleRating;
}
