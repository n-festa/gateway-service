import { Module, forwardRef } from '@nestjs/common';
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
import { WebCustomerRatingAndReviewController } from './controller/web.customer.rating&review.controller';
import { WebCustomerRatingAndReviewService } from './service/web.customer.rating&review.service';
import { WebOrderService } from './service/web.order.service';
import { WebCustomerOrderController } from './controller/web.customer.order.controller';
import { WebCustomerOrderService } from './service/web.customer.order.service';
import { AhamoveModule } from 'src/dependency/ahamove/ahamove.module';
import { MomoModule } from 'src/dependency/momo/momo.module';

@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.register({}),
    forwardRef(() => AhamoveModule),
    forwardRef(() => MomoModule),
  ],
  controllers: [
    WebCustomerAuthController,
    WebCustomerController,
    WebCustomerFoodController,
    WebCustomerRestaurantController,
    WebCustomerCategoryController,
    WebCustomerCartController,
    WebCustomerRatingAndReviewController,
    WebCustomerOrderController,
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
    WebCustomerRatingAndReviewService,
    WebOrderService,
    WebCustomerOrderService,
  ],
  exports: [
    WebCustomerAuthService,
    WebCustomerService,
    WebCustomerFoodService,
    WebCustomerRestaurantService,
    WebCustomerCategoryService,
    WebCustomerCartService,
    WebCustomerRatingAndReviewService,
    WebCustomerService,
    WebOrderService,
    WebCustomerOrderService,
  ],
})
export class WebCustomerModule {}
