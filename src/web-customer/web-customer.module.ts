import { Module } from '@nestjs/common';
import { WebCustomerAuthController } from './controller/web.customer.auth.controller';
import { WebCustomerAuthService } from './service/web.customer.auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WebCustomerController } from './controller/web.customer.controller';
import { WebCustomerService } from './service/web.customer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenJwtStrategy } from 'src/strategies/access-jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHORIZATION_SERVICE',
        transport: Transport.TCP,
        options: { port: 3011 },
      },
    ]),
    PassportModule.register({}),
    JwtModule.register({}),
  ],
  controllers: [WebCustomerAuthController, WebCustomerController],
  providers: [
    WebCustomerAuthService,
    WebCustomerService,
    AccessTokenJwtStrategy,
  ],
  exports: [WebCustomerAuthService, WebCustomerService],
})
export class WebCustomerModule {}
