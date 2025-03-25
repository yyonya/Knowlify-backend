import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class ResponseLoginUserDto {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  token: string;
}

export class UserFromTokenDto {
  @Expose()
  userId: number;
}
