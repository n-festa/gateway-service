import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';

@Injectable()
export class WebCustomerRestaurantService {
  @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy;
  async getGeneralRestaurantRecomendation(
    data: RestaurantRecommendationRequest,
  ): Promise<any> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_restaurant_recomendation' },
        data,
      ),
    );
  }
}
