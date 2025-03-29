import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

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
  @IsString()
  workspace_name: string;
  @IsArray()
  @ValidateNested({ each: true })
  pages: UserPageDto[];
}

class UserPageDto {
  @IsNumber()
  page_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsNumber()
  parent_page_id: number | null;

  @IsNumber()
  @Min(0)
  depth: number;

  @IsOptional()
  @IsUrl()
  picture_url: string | null;

  @IsOptional()
  @IsUrl()
  avatar_url: string | null;

  @IsOptional()
  @IsString()
  type: string | null;

  @IsOptional()
  @IsBoolean()
  is_public: boolean | null;

  @IsOptional()
  @IsString()
  category: string | null;

  @IsOptional()
  @IsString()
  subscription_type: string | null;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;
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
