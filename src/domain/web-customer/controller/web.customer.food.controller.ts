import { Body, Controller, Get, Inject } from '@nestjs/common';
import { WebCustomerFoodService } from '../service/web.customer.food.service';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { SearchFoodByNameRequest } from '../dto/search-food-by-name-request.dto';
@ApiTags('Web customer food')
@Controller('web-customer/food')
export class WebCustomerFoodController {
  constructor(
    private readonly foodService: WebCustomerFoodService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  @Get('get-general-food-recomendation')
  async getGeneralFoodRecomendation(
    @Body() foodRequest: FoodRecommendationRequest,
  ): Promise<any> {
    return await this.foodService.getGeneralFoodRecomendation(foodRequest);
  }

  @Get('search-by-name')
  async searchByName(
    @Body() searchRequest: SearchFoodByNameRequest,
  ): Promise<any> {
    if (this.flagService.isFeatureEnabled('fes-12-search-food-by-name')) {
      return await this.foodService.searchByName(searchRequest);
    } else {
    }
  }
}
