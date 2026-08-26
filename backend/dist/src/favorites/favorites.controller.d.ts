import { FavoritesService } from './favorites.service';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(user: AuthenticatedUser): import(".prisma/client").Prisma.PrismaPromise<({
        vehicle: {
            brand: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                country: string | null;
                slug: string;
                logoUrl: string | null;
            };
            model: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                brandId: string;
                startYear: number | null;
                endYear: number | null;
                bodyType: string | null;
            };
            images: {
                id: string;
                createdAt: Date;
                url: string;
                altText: string | null;
                position: number;
                isPrimary: boolean;
                vehicleId: string;
            }[];
        } & {
            isFeatured: boolean;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            country: string;
            currency: string;
            slug: string;
            brandId: string;
            title: string;
            vin: string | null;
            year: number;
            price: number;
            mileage: number;
            mileageUnit: string;
            fuelType: import(".prisma/client").$Enums.FuelType;
            transmission: import(".prisma/client").$Enums.TransmissionType;
            condition: import(".prisma/client").$Enums.VehicleCondition;
            status: import(".prisma/client").$Enums.VehicleStatus;
            color: string | null;
            doors: number | null;
            seats: number | null;
            enginePower: number | null;
            engineSizeCc: number | null;
            city: string;
            latitude: number | null;
            longitude: number | null;
            viewsCount: number;
            averageRating: number;
            reviewsCount: number;
            modelId: string;
            categoryId: string;
            sellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        vehicleId: string;
    })[]>;
    add(user: AuthenticatedUser, vehicleId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        vehicleId: string;
    }>;
    remove(user: AuthenticatedUser, vehicleId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        vehicleId: string;
    }>;
}
