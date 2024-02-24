import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebOrderService {
  @Inject('RESTAURANT_SERVICE')
  private readonly restaurantClient: ClientProxy;
  async getOrderById(orderId) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_order_by_id' }, orderId),
    );
  }
  async updateOrderStatusByWebhook(orderId, webhookData) {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'update_order_status_by_webhook' },
        { delivery_order_id: orderId, webhookData: webhookData },
      ),
    );
  }
}
