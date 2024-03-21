import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WebRestaurantService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
  ) {}

  async confirmOrder(order_id: number) {
    return await lastValueFrom(
      this.restaurantClient.send(
        { cmd: 'confirm_order_from_restaurant' },
        { order_id },
      ),
    );
  }
}
