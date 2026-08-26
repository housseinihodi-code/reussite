import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
export declare class ContactService {
    private readonly prisma;
    private readonly mail;
    private readonly logger;
    constructor(prisma: PrismaService, mail: MailService);
    create(dto: CreateContactMessageDto): Promise<{
        message: string;
    }>;
}
