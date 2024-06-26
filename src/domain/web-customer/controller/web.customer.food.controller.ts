import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WebCustomerFoodService } from '../service/web.customer.food.service';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { SearchFoodByNameRequest } from '../dto/search-food-by-name-request.dto';
import { GetSideDishResonse } from '../dto/get-side-dish-response.dto';
import { GetSideDishRequest } from '../dto/get-side-dish-request.dto';
import { FetchMode } from 'src/enum';
import { FoodRecommendationResponse } from '../dto/food-recommendation-response.dto';
import { GetFoodDetailResponse } from '../dto/get-food-detail-response.dto';
import { GetHotFoodResponse } from '../dto/get-hot-food-response.dto';
import { GetAvailableFoodByRestaurantResponse } from '../dto/get-available-food-by-restaurant-response.dto';
import { GetAvailableFoodByRestaurantRequest } from '../dto/get-available-food-by-restaurant-request.dto';
import { GetSideDishQuery } from '../dto/get-side-dish-query.dto';
import { GetSimilarFoodQuery } from '../dto/get-similar-food-query.dto';
import { GetSimilarFoodResponse } from '../dto/get-similar-food-response.dto';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { SearchFoodRequest } from '../dto/search-food-request.dto';
import { SearchFoodResponse } from '../dto/search-food-response.dto';
@ApiTags('Web customer food')
@Controller('web-customer/food')
export class WebCustomerFoodController {
  constructor(
    private readonly foodService: WebCustomerFoodService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  @Get('get-general-food-recomendation')
  async getGeneralFoodRecomendation(
    // @Body() foodRequest: FoodRecommendationRequest,
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('fetch_mode') fetch_mode: FetchMode = FetchMode.Some,
  ): Promise<FoodRecommendationResponse> {
    const FoodRecommendationRequest: FoodRecommendationRequest = {
      lat: lat,
      long: long,
      fetch_mode: fetch_mode,
    };
    const res = await this.foodService.getGeneralFoodRecomendation(
      FoodRecommendationRequest,
    );
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getGeneralFoodRecomendation

  // @Get('search-by-name')
  @Post('search-by-name')
  @HttpCode(200)
  async searchByName(
    @Body() searchRequest: SearchFoodByNameRequest,
  ): Promise<any> {
    const res = await this.foodService.searchByName(searchRequest);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of searchByName

  @Get('get-detail/:id')
  async getFoodDetailById(
    @Param('id') id: number,
  ): Promise<GetFoodDetailResponse> {
    const res = await this.foodService.getFoodDetailById(id);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getFoodDetailById

  @Get('get-sku-list/:id')
  async getListOfSkuById(@Param('id') id: number) {
    const res = await this.foodService.getListOfSkuById(id);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getListOfSkuById

  @Get('get-side-dish/:id')
  async getSideDishByMenuItemId(
    @Param('id') id: number,
    @Query() query: GetSideDishQuery,
  ): Promise<GetSideDishResonse> {
    const inputData: GetSideDishRequest = {
      menu_item_id: id,
      timestamp: Date.now(),
      fetch_mode: query.fetch_mode,
    };
    const res = await this.foodService.getSideDishByMenuItemId(inputData);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getSideDishByMenuItemId

  @Get('get-hot-food')
  async getHotFood(): Promise<GetHotFoodResponse> {
    const res = new GetHotFoodResponse(200, '');
    const serviceRes = await this.foodService.getHotFood();
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;
    return res;
  } // end of getHotFood

  @Post('get-available-food-by-restaurant')
  @HttpCode(200)
  async getAvailableFoodByRestaurant(
    @Body() data: GetAvailableFoodByRestaurantRequest,
  ): Promise<GetAvailableFoodByRestaurantResponse> {
    const res = new GetAvailableFoodByRestaurantResponse(200, '');
    const serviceRes =
      await this.foodService.getAvailableFoodByRestaurant(data);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }
    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of getAvailableFoodByRestaurant

  @Get('get-similar-food')
  async getSimimarFood(
    @Query() query: GetSimilarFoodQuery,
  ): Promise<GetSimilarFoodResponse> {
    try {
      const res = await this.foodService.getSimilarFood(query);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('search')
  @HttpCode(200)
  async searchFood(
    @Body() searchRequest: SearchFoodRequest,
  ): Promise<SearchFoodResponse> {
    try {
      const res = await this.foodService.searchFood(searchRequest);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
}
