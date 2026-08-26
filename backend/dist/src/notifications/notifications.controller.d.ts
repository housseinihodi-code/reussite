import { NotificationsService } from './notifications.service';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthenticatedUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    markAsRead(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    markAllAsRead(user: AuthenticatedUser): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
