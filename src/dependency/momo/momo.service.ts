import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MomoService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
  ) {}
  async createMomoPayment(momoOrder: any) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'create_momo_payment' }, momoOrder),
    );
  }

  async momoIpnCallback(momoCallback: any) {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'momo_payment_ipn_callback' },
        momoCallback,
      ),
    );
  }
}
