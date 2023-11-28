import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';

@Injectable()
export class WebCustomerFoodService {
  @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy;
  async getGeneralFoodRecomendation(
    data: FoodRecommendationRequest,
  ): Promise<any> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_food_recomendation' },
        data,
      ),
    );
  }
}
