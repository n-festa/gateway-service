import { Body, Controller, Get } from '@nestjs/common';
import { WebCustomerFoodService } from '../service/web.customer.food.service';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';

@Controller('web-customer/food')
export class WebCustomerFoodController {
  constructor(private readonly foodService: WebCustomerFoodService) {}

  @Get('get-general-food-recomendation')
  async getGeneralFoodRecomendation(
    @Body() foodRequest: FoodRecommendationRequest,
  ): Promise<any> {
    return this.foodService.getGeneralFoodRecomendation(foodRequest);
  }
}
