import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { GetRestaurantDetailResponse } from '../dto/get-restaurant-detail-response.dto';
import { GetRestaurantDetailRequest } from '../dto/get-restaurant-detail-request.dto';

@Injectable()
export class WebCustomerRestaurantService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  async getGeneralRestaurantRecomendation(
    data: RestaurantRecommendationRequest,
  ): Promise<any> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_restaurant_recomendation' },
        data,
      ),
    );
  } // end of getGeneralRestaurantRecomendation

  async getRestaurantDetails(
    data: GetRestaurantDetailRequest,
  ): Promise<GetRestaurantDetailResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_restaurant_details' }, data),
    );
  } // end of getRestaurantDetails
}
