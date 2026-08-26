import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(user: AuthenticatedUser & {
        refreshToken: string;
    }): Promise<import("./auth.service").TokenPair>;
    logout(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    becomeSeller(user: AuthenticatedUser): Promise<{
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
