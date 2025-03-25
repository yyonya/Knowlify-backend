import { Expose } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class JwtPayloadDto {
  @IsNumber()
  @IsPositive()
  @Expose()
  user_id: number;

  @IsNumber()
  @IsPositive()
  @Expose({ name: 'iat' })
  issuedAt: number;

  @IsNumber()
  @IsPositive()
  @Expose({ name: 'exp' })
  expiresAt: number;
}
