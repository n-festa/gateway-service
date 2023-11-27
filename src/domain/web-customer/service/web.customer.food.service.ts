import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebCustomerFoodService {
  @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy;
  async getGeneralFoodRecomendation(): Promise<any> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_general_food_recomendation' }, {}),
    );
  }
}
