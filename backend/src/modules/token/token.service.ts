import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly confidService: ConfigService,
  ) {}

  async generateJwtToken(user_id: number): Promise<string> {
    const payload = { user_id: user_id };
    return this.jwtService.signAsync(payload, {
      secret: this.confidService.get('secret_jwt'),
      expiresIn: this.confidService.get('expire_jwt'),
    });
  }
}
