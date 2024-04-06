import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateMenuItemRequest } from './dto/create-menu-item-request.dto';
import { CreateMenuItemResponse } from './dto/create-menu-item-response.dto';

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

  async createMenuItem(
    data: CreateMenuItemRequest,
  ): Promise<CreateMenuItemResponse> {
    return await lastValueFrom(
      this.restaurantClient.send(
        { cmd: 'create_menu_item_from_restaurant' },
        data,
      ),
    );
  }
}
