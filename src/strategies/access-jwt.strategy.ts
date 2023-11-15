import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';
// import { ConfigService } from '@eats/config';
import { JWT_SECRET } from 'src/app.constants';

// Bearer <>//

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  @Inject('AUTHORIZATION_SERVICE') private readonly authService: ClientProxy;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //   secretOrKey: configService.get().auth.access_token_secret,
      secretOrKey: JWT_SECRET.access_token,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await firstValueFrom(
      this.authService.send({ cmd: 'validate_jwt_payload' }, payload),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
