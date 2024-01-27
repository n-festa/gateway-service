import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { WebCustomerRestaurantService } from '../service/web.customer.restaurant.service';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { GetRestaurantDetailResponse } from '../dto/get-restaurant-detail-response.dto';
import { GetRestaurantDetailRequest } from '../dto/get-restaurant-detail-request.dto';

@ApiTags('Web customer restaurant')
@Controller('web-customer/restaurant')
export class WebCustomerRestaurantController {
  constructor(
    private readonly restaurantService: WebCustomerRestaurantService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  @Get('get-general-recomendation')
  async getGeneralRestaurantRecomendation(
    // @Body() requestData: RestaurantRecommendationRequest,
    @Query('lat') lat: number,
    @Query('long') long: number,
  ): Promise<any> {
    const data: RestaurantRecommendationRequest = {
      lat: lat,
      long: long,
    };
    const res =
      await this.restaurantService.getGeneralRestaurantRecomendation(data);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getGeneralRestaurantRecomendation

  @Get('get-detail/:id')
  async getRestaurantDetails(
    @Param('id') id: number,
    @Query('lat') lat: number,
    @Query('long') long: number,
  ): Promise<GetRestaurantDetailResponse> {
    const res = new GetRestaurantDetailResponse(200, '');
    const resquestData: GetRestaurantDetailRequest = {
      restaurant_id: id,
      lat: lat,
      long: long,
    };
    const serviceRes =
      await await this.restaurantService.getRestaurantDetails(resquestData);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }
    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;
    return res;
  } // end of getRestaurantDetails
}
