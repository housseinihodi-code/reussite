import { PrismaService } from '@/prisma/prisma.service';
import { CreateModelDto, UpdateModelDto } from './dto/model.dto';
export declare class ModelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateModelDto): import(".prisma/client").Prisma.Prisma__ModelClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        brandId: string;
        startYear: number | null;
        endYear: number | null;
        bodyType: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByBrand(brandId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        brandId: string;
        startYear: number | null;
        endYear: number | null;
        bodyType: string | null;
    }[]>;
    findOne(id: string): Promise<{
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        brandId: string;
        startYear: number | null;
        endYear: number | null;
        bodyType: string | null;
    }>;
    update(id: string, dto: UpdateModelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        brandId: string;
        startYear: number | null;
        endYear: number | null;
        bodyType: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        brandId: string;
        startYear: number | null;
        endYear: number | null;
        bodyType: string | null;
    }>;
}
