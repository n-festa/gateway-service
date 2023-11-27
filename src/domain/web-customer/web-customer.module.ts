import { Module } from '@nestjs/common';
import { WebCustomerAuthController } from './controller/web.customer.auth.controller';
import { WebCustomerAuthService } from './service/web.customer.auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WebCustomerController } from './controller/web.customer.controller';
import { WebCustomerService } from './service/web.customer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenJwtStrategy } from 'src/strategies/access-jwt.strategy';
import { RefreshTokenJwtStrategy } from 'src/strategies/refresh-jwt.strategy';
import { WebCustomerFoodController } from './controller/web.customer.food.controller';
import { WebCustomerFoodService } from './service/web.customer.food.service';
import { WebCustomerRestaurantController } from './controller/web.customer.restaurant.controller';
import { WebCustomerRestaurantService } from './service/web.customer.restaurant.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHORIZATION_SERVICE',
        transport: Transport.TCP,
        options: { port: 3011 },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3018 },
      },
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.TCP,
        options: { port: 3014 },
      },
    ]),
    PassportModule.register({}),
    JwtModule.register({}),
  ],
  controllers: [
    WebCustomerAuthController,
    WebCustomerController,
    WebCustomerFoodController,
    WebCustomerRestaurantController,
  ],
  providers: [
    WebCustomerAuthService,
    WebCustomerService,
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    WebCustomerFoodService,
    WebCustomerRestaurantService,
  ],
  exports: [
    WebCustomerAuthService,
    WebCustomerService,
    WebCustomerFoodService,
    WebCustomerRestaurantService,
  ],
})
export class WebCustomerModule {}
