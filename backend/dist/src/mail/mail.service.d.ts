import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private readonly transporter;
    constructor(config: ConfigService);
    sendPasswordReset(to: string, resetUrl: string): Promise<void>;
    sendContactMessage(name: string, replyTo: string, message: string): Promise<void>;
}
