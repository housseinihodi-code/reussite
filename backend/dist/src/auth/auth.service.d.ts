import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly mail;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, mail: MailService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            passwordHash: string;
            phone: string | null;
            avatarUrl: string | null;
            isEmailVerified: boolean;
            isActive: boolean;
            country: string | null;
            locale: string;
            currency: string;
            roleIds: string[];
            refreshTokenHash: string | null;
            lastLoginAt: Date | null;
            passwordResetTokenHash: string | null;
            passwordResetExpiresAt: Date | null;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            roles: {
                id: string;
                name: import(".prisma/client").$Enums.RoleName;
                description: string | null;
                permissions: string[];
                userIds: string[];
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            passwordHash: string;
            phone: string | null;
            avatarUrl: string | null;
            isEmailVerified: boolean;
            isActive: boolean;
            country: string | null;
            locale: string;
            currency: string;
            roleIds: string[];
            refreshTokenHash: string | null;
            lastLoginAt: Date | null;
            passwordResetTokenHash: string | null;
            passwordResetExpiresAt: Date | null;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    refresh(userId: string, refreshToken: string): Promise<TokenPair>;
    becomeSeller(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            roles: {
                id: string;
                name: import(".prisma/client").$Enums.RoleName;
                description: string | null;
                permissions: string[];
                userIds: string[];
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            passwordHash: string;
            phone: string | null;
            avatarUrl: string | null;
            isEmailVerified: boolean;
            isActive: boolean;
            country: string | null;
            locale: string;
            currency: string;
            roleIds: string[];
            refreshTokenHash: string | null;
            lastLoginAt: Date | null;
            passwordResetTokenHash: string | null;
            passwordResetExpiresAt: Date | null;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private issueTokens;
    private persistRefreshToken;
    private sanitize;
}
