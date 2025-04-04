import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/strategy/dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(user_id: number): Promise<string> {
    const payload = { user_id: user_id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('secret_jwt'),
      expiresIn: this.configService.get('expire_jwt'),
    });
  }

  verifyJwtToken(token: string): JwtPayloadDto {
    return this.jwtService.verify<JwtPayloadDto>(token, {
      secret: this.configService.get<string>('secret_jwt'),
    });
  }
}
