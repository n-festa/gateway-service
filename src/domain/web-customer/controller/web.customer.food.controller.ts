import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
} from '@nestjs/common';
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

  @Get('get-detail/:id')
  async getFoodDetailById(@Param('id') id: number) {
    if (this.flagService.isFeatureEnabled('fes-15-get-food-detail')) {
      const res = await this.foodService.getFoodDetailById(id);
      if (res.statusCode >= 400) {
        throw new HttpException(res, res.statusCode);
      }
      return res;
    } else {
    }
  }

  @Get('get-sku-list/:id')
  async getListOfSkuById(@Param('id') id: number) {
    if (this.flagService.isFeatureEnabled('fes-16-get-list-of-skus')) {
      const res = await this.foodService.getListOfSkuById(id);
      if (res.statusCode >= 400) {
        throw new HttpException(res, res.statusCode);
      }
      return res;
    } else {
    }
  }
}
