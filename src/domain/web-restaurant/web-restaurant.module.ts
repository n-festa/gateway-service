import { Module } from '@nestjs/common';
import { WebRestaurantController } from './web-restaurant.controller';
import { WebRestaurantService } from './web-restaurant.service';

@Module({
  imports: [],
  exports: [WebRestaurantService],
  controllers: [WebRestaurantController],
  providers: [WebRestaurantService],
})
export class WebRestaurantModule {}
