import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from './dto';
import { UsersService } from 'src/modules/users/users.service';
import { ErrorLog } from 'src/errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret_jwt') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayloadDto): Promise<any> {
    const user = await this.userService.findUserById(payload.user_id);
    if (!user) {
      throw new UnauthorizedException(ErrorLog.JWT_FAILTURE);
    }
    return { userId: payload.user_id };
  }
}
