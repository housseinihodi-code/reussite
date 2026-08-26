import { PrismaService } from '@/prisma/prisma.service';
import { AddImageDto } from './dto/add-image.dto';
export declare class ImagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private assertOwnership;
    add(sellerId: string, dto: AddImageDto): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
    remove(id: string, sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
    setPrimary(id: string, sellerId: string): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
}
