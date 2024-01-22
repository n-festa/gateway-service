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

@ApiTags('Web customer restaurant')
@Controller('web-customer/restaurant')
export class WebCustomerRestaurantController {
  constructor(
    private readonly restaurantService: WebCustomerRestaurantService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  @Get('get-general-recomendation')
  async getGeneralRestaurantRecomendation(
    @Body() requestData: RestaurantRecommendationRequest,
    @Query('lat') lat: number,
    @Query('long') long: number,
  ): Promise<any> {
    if (this.flagService.isFeatureEnabled('fes-30-refactor-get-method')) {
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
    }
    const res =
      await this.restaurantService.getGeneralRestaurantRecomendation(
        requestData,
      );
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @Get('get-detail/:id')
  async getRestaurantDetails(@Param('id') id: number) {
    const res = await await this.restaurantService.getRestaurantDetails(id);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
}
