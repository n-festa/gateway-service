import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class AhamoveService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
  ) {}

  async connect(orderId: string, response: Response) {
    const data = { orderId, response };
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_update_tracking_data' }, data),
    );
  }

  async getAhamoveOrderByOrderId(orderId: string) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_ahamove_order_by_id' }, orderId),
    );
  }

  async saveAhamoveTrackingWebhook(order: any) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'save_ahamove_order_tracking' }, order),
    );
  }

  async estimatePrice(coordinates: any) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_ahamove_estimate' }, coordinates),
    );
  }

  async postAhamoveOrder(order: any) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'create_ahamove_order' }, order),
    );
  }
}
