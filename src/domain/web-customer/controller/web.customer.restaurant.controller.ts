import { Controller, Get } from '@nestjs/common';
import { WebCustomerRestaurantService } from '../service/web.customer.restaurant.service';

@Controller('web-customer/restaurant')
export class WebCustomerRestaurantController {
  constructor(
    private readonly restaurantService: WebCustomerRestaurantService,
  ) {}

  @Get('get-general-recomendation')
  async getGeneralRestaurantRecomendation(): Promise<any> {
    return this.restaurantService.getGeneralRestaurantRecomendation();
  }
}
