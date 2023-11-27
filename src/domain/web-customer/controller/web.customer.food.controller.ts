import { Controller, Get } from '@nestjs/common';
import { WebCustomerFoodService } from '../service/web.customer.food.service';

@Controller('web-customer/food')
export class WebCustomerFoodController {
  constructor(private readonly foodService: WebCustomerFoodService) {}

  @Get('get-general-food-recomendation')
  async getGeneralFoodRecomendation(): Promise<any> {
    console.log('run getGeneralFoodRecomendation');
    return this.foodService.getGeneralFoodRecomendation();
  }
}
