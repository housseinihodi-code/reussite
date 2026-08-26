import { IsMongoId, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsMongoId()
  userId: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
