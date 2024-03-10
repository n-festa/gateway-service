import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetApplicationFeeRequest } from '../dto/get-application-fee-request.dto';
import { firstValueFrom } from 'rxjs';
import { GetApplicationFeeResponse } from '../dto/get-application-fee-response.dto';

@Injectable()
export class WebCustomerOrderService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
  ) {}

  async getApplicationFee(
    requestData: GetApplicationFeeRequest,
  ): Promise<GetApplicationFeeResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_application_fee' }, requestData),
    );
  }
}
