import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cet email.');

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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: true },
    });
    if (!user) throw new UnauthorizedException('Identifiants invalides.');

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) throw new UnauthorizedException('Identifiants invalides.');

    const roleNames = user.roles.map((r) => r.name);
    const tokens = await this.issueTokens(user.id, user.email, roleNames);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
    if (!user?.refreshTokenHash) throw new UnauthorizedException();

    const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!valid) throw new UnauthorizedException();

    const roleNames = user.roles.map((r) => r.name);
    const tokens = await this.issueTokens(user.id, user.email, roleNames);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async becomeSeller(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
    if (!user) throw new UnauthorizedException();

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

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
    return { message: 'Déconnexion réussie.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const genericResponse = { message: 'Si ce compte existe, un email de réinitialisation a été envoyé.' };
    if (!user) return genericResponse;

    const resetToken = nanoid(32);
    const passwordResetTokenHash = await argon2.hash(resetToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash,
        passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const frontendUrl = this.config.get<string>('corsOrigins')?.[0] ?? 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&uid=${user.id}`;
    await this.mail.sendPasswordReset(user.email, resetUrl);

    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user?.passwordResetTokenHash || !user.passwordResetExpiresAt) {
      throw new UnauthorizedException('Lien de réinitialisation invalide.');
    }
    if (user.passwordResetExpiresAt < new Date()) {
      throw new UnauthorizedException('Ce lien de réinitialisation a expiré.');
    }

    const valid = await argon2.verify(user.passwordResetTokenHash, dto.token);
    if (!valid) throw new UnauthorizedException('Lien de réinitialisation invalide.');

    const passwordHash = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, passwordResetTokenHash: null, passwordResetExpiresAt: null, refreshTokenHash: null },
    });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  private async issueTokens(sub: string, email: string, roles: string[]): Promise<TokenPair> {
    const payload = { sub, email, roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
  }

  private sanitize<T extends { passwordHash?: string; refreshTokenHash?: string | null }>(user: T) {
    const { passwordHash, refreshTokenHash, ...rest } = user;
    return rest;
  }
}
