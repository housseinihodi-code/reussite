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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const nanoid_1 = require("nanoid");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config, mail) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.mail = mail;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Un compte existe déjà avec cet email.');
        const passwordHash = await argon2.hash(dto.password);
        const buyerRole = await this.prisma.role.upsert({
            where: { name: 'BUYER' },
            update: {},
            create: { name: 'BUYER', description: 'Acheteur standard' },
        });
        const user = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                passwordHash,
                phone: dto.phone,
                country: dto.country,
                roleIds: [buyerRole.id],
            },
        });
        const tokens = await this.issueTokens(user.id, user.email, ['BUYER']);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return { user: this.sanitize(user), ...tokens };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { roles: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides.');
        const passwordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!passwordValid)
            throw new common_1.UnauthorizedException('Identifiants invalides.');
        const roleNames = user.roles.map((r) => r.name);
        const tokens = await this.issueTokens(user.id, user.email, roleNames);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return { user: this.sanitize(user), ...tokens };
    }
    async refresh(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
        if (!user?.refreshTokenHash)
            throw new common_1.UnauthorizedException();
        const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
        if (!valid)
            throw new common_1.UnauthorizedException();
        const roleNames = user.roles.map((r) => r.name);
        const tokens = await this.issueTokens(user.id, user.email, roleNames);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async becomeSeller(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
        if (!user)
            throw new common_1.UnauthorizedException();
        const sellerRole = await this.prisma.role.upsert({
            where: { name: 'SELLER' },
            update: {},
            create: { name: 'SELLER', description: 'Vendeur de véhicules' },
        });
        const alreadySeller = user.roles.some((role) => role.id === sellerRole.id);
        const updatedUser = alreadySeller
            ? user
            : await this.prisma.user.update({
                where: { id: userId },
                data: { roleIds: { push: sellerRole.id } },
                include: { roles: true },
            });
        const roleNames = alreadySeller
            ? user.roles.map((role) => role.name)
            : [...user.roles.map((role) => role.name), sellerRole.name];
        const tokens = await this.issueTokens(userId, user.email, roleNames);
        await this.persistRefreshToken(userId, tokens.refreshToken);
        return { user: this.sanitize(updatedUser), ...tokens };
    }
    async logout(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
        return { message: 'Déconnexion réussie.' };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        const genericResponse = { message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' };
        if (!user)
            return genericResponse;
        const resetToken = (0, nanoid_1.nanoid)(32);
        const passwordResetTokenHash = await argon2.hash(resetToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetTokenHash,
                passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
        });
        const frontendUrl = this.config.get('corsOrigins')?.[0] ?? 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&uid=${user.id}`;
        await this.mail.sendPasswordReset(user.email, resetUrl);
        return genericResponse;
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user?.passwordResetTokenHash || !user.passwordResetExpiresAt) {
            throw new common_1.UnauthorizedException('Lien de réinitialisation invalide.');
        }
        if (user.passwordResetExpiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Ce lien de réinitialisation a expiré.');
        }
        const valid = await argon2.verify(user.passwordResetTokenHash, dto.token);
        if (!valid)
            throw new common_1.UnauthorizedException('Lien de réinitialisation invalide.');
        const passwordHash = await argon2.hash(dto.newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash, passwordResetTokenHash: null, passwordResetExpiresAt: null, refreshTokenHash: null },
        });
        return { message: 'Mot de passe réinitialisé avec succès.' };
    }
    async issueTokens(sub, email, roles) {
        const payload = { sub, email, roles };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get('jwt.accessSecret'),
                expiresIn: this.config.get('jwt.accessExpiresIn'),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get('jwt.refreshSecret'),
                expiresIn: this.config.get('jwt.refreshExpiresIn'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async persistRefreshToken(userId, refreshToken) {
        const refreshTokenHash = await argon2.hash(refreshToken);
        await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
    }
    sanitize(user) {
        const { passwordHash, refreshTokenHash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map