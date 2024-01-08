import { Module } from '@nestjs/common';
import { WebCustomerAuthController } from './controller/web.customer.auth.controller';
import { WebCustomerAuthService } from './service/web.customer.auth.service';
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
import { WebCustomerCategoryController } from './controller/web.customer.category.controller';
import { WebCustomerCategoryService } from './service/web.customer.category.service';
import { WebCustomerCartController } from './controller/web.customer.cart.controller';
import { WebCustomerCartService } from './service/web.customer.cart.service';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({})],
  controllers: [
    WebCustomerAuthController,
    WebCustomerController,
    WebCustomerFoodController,
    WebCustomerRestaurantController,
    WebCustomerCategoryController,
    WebCustomerCartController,
  ],
  providers: [
    WebCustomerAuthService,
    WebCustomerService,
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    WebCustomerFoodService,
    WebCustomerRestaurantService,
    WebCustomerCategoryService,
    WebCustomerCartService,
  ],
  exports: [
    WebCustomerAuthService,
    WebCustomerService,
    WebCustomerFoodService,
    WebCustomerRestaurantService,
    WebCustomerCategoryService,
    WebCustomerCartService,
  ],
})
export class WebCustomerModule {}
