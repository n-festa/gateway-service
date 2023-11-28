import { Body, Controller, Get } from '@nestjs/common';
import { WebCustomerRestaurantService } from '../service/web.customer.restaurant.service';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';

@Controller('web-customer/restaurant')
export class WebCustomerRestaurantController {
  constructor(
    private readonly restaurantService: WebCustomerRestaurantService,
  ) {}

  @Get('get-general-recomendation')
  async getGeneralRestaurantRecomendation(
    @Body() requestData: RestaurantRecommendationRequest,
  ): Promise<any> {
    return this.restaurantService.getGeneralRestaurantRecomendation(
      requestData,
    );
  }
}
