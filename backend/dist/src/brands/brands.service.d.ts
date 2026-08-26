import { PrismaService } from '@/prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
export declare class BrandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBrandDto): import(".prisma/client").Prisma.Prisma__BrandClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        country: string | null;
        slug: string;
        logoUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        country: string | null;
        slug: string;
        logoUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        models: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            brandId: string;
            startYear: number | null;
            endYear: number | null;
            bodyType: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        country: string | null;
        slug: string;
        logoUrl: string | null;
    }>;
    update(id: string, dto: UpdateBrandDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        country: string | null;
        slug: string;
        logoUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        country: string | null;
        slug: string;
        logoUrl: string | null;
    }>;
}
