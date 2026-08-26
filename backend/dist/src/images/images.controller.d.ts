import { ImagesService } from './images.service';
import { AddImageDto } from './dto/add-image.dto';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    add(user: AuthenticatedUser, dto: AddImageDto): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
    setPrimary(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        position: number;
        isPrimary: boolean;
        vehicleId: string;
    }>;
}
