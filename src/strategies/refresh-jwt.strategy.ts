import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@eats/config';
import { JWT_SECRET_REFRESH_TOKEN } from 'src/app.constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// Bearer <>//

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  @Inject('AUTHORIZATION_SERVICE') private readonly authService: ClientProxy;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //   secretOrKey: configService.get().auth.refresh_token_secret,
      secretOrKey: JWT_SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await firstValueFrom(
      this.authService.send({ cmd: 'validate_jwt_payload' }, payload),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...payload, refresh_token: refreshToken };
  }
}
