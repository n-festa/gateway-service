import { Module } from '@nestjs/common';
import { WebCustomerAuthController } from './controller/web.customer.auth.controller';
import { WebCustomerAuthService } from './service/web.customer.auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHORIZATION_SERVICE',
        transport: Transport.TCP,
        options: { port: 3011 },
      },
    ]),
  ],
  controllers: [WebCustomerAuthController],
  providers: [WebCustomerAuthService],
  exports: [WebCustomerAuthService],
})
export class WebCustomerModule {}
