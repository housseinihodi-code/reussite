import { PrismaService } from '@/prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    global(query: SearchQueryDto): Promise<{
        vehicles: ({
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
        })[];
        brands: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            country: string | null;
            slug: string;
            logoUrl: string | null;
        }[];
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            parentId: string | null;
        }[];
    }>;
}
