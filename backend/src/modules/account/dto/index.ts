import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class ResponseLoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  token: string;
}

export class RequestPasswordResetDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  newPassword: string;
}

export class UserFromTokenDto {
  @Expose()
  userId: number;
}
