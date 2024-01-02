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
    const res = await this.foodService.getGeneralFoodRecomendation(foodRequest);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @Get('search-by-name')
  async searchByName(
    @Body() searchRequest: SearchFoodByNameRequest,
  ): Promise<any> {
    const res = await this.foodService.searchByName(searchRequest);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @Get('get-detail/:id')
  async getFoodDetailById(@Param('id') id: number) {
    const res = await this.foodService.getFoodDetailById(id);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @Get('get-sku-list/:id')
  async getListOfSkuById(@Param('id') id: number) {
    const res = await this.foodService.getListOfSkuById(id);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
}
