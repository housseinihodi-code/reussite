"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.config.get('mail.host'),
            port: this.config.get('mail.port'),
            auth: {
                user: this.config.get('mail.user'),
                pass: this.config.get('mail.password'),
            },
        });
    }
    async sendPasswordReset(to, resetUrl) {
        const from = this.config.get('mail.from');
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
        }
        catch (error) {
            this.logger.warn(`Échec de l'envoi de l'email de réinitialisation à ${to}: ${error.message}`);
        }
    }
    async sendContactMessage(name, replyTo, message) {
        const from = this.config.get('mail.from');
        const to = this.config.get('mail.contactTo');
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
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map