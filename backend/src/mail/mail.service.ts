import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.password'),
      },
    });
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    const from = this.config.get<string>('mail.from');
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Fast Deals Auto — Réinitialisation de votre mot de passe',
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe Fast Deals Auto.</p>
          <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a> (valable 1 heure).</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        `,
      });
    } catch (error) {
      this.logger.warn(`Échec de l'envoi de l'email de réinitialisation à ${to}: ${(error as Error).message}`);
    }
  }

  async sendContactMessage(name: string, replyTo: string, message: string) {
    const from = this.config.get<string>('mail.from');
    const to = this.config.get<string>('mail.contactTo');
    await this.transporter.sendMail({
      from,
      to,
      replyTo,
      subject: `Fast Deals Auto — Nouveau message de contact de ${name}`,
      html: `
        <p><strong>De :</strong> ${name} (${replyTo})</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
  }
}
