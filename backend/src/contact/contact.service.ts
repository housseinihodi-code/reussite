import { Injectable, Logger } from '@nestjs/common';
import { LogLevel } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateContactMessageDto) {
    // Always persisted first, so the message is never lost even if SMTP
    // isn't configured — email delivery below is best-effort on top of that.
    await this.prisma.log.create({
      data: {
        level: LogLevel.INFO,
        context: 'contact-form',
        message: dto.message,
        meta: { name: dto.name, email: dto.email },
      },
    });

    try {
      await this.mail.sendContactMessage(dto.name, dto.email, dto.message);
    } catch (error) {
      this.logger.warn(`Échec de l'envoi de l'email de contact de ${dto.email}: ${(error as Error).message}`);
    }

    return { message: 'Votre message a bien été envoyé.' };
  }
}
