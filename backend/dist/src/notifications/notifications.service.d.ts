import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, type: NotificationType, title: string, message: string, metadata?: Record<string, unknown>): Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: Prisma.JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllForUser(userId: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: Prisma.JsonValue | null;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        metadata: Prisma.JsonValue | null;
    }>;
    markAllAsRead(userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
}
