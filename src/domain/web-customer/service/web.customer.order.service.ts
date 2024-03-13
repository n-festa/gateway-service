import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetApplicationFeeRequest } from '../dto/get-application-fee-request.dto';
import { firstValueFrom } from 'rxjs';
import { GetApplicationFeeResponse } from '../dto/get-application-fee-response.dto';
import { GetPaymentMethodResponse } from '../dto/get-payment-method-response.dto';
import { GetCutleryFeeRequest } from '../dto/get-cutlery-fee-request.dto';
import { GetCutleryFeeResponse } from '../dto/get-cutlery-fee-response.dto';
import { GetCouponInfoRequest } from '../dto/get-coupon-info-request.dto';
import { GetCouponInfoResponse } from '../dto/get-coupon-info-response.dto';

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

  async getPaymentMethod(): Promise<GetPaymentMethodResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_payment_method' }, {}),
    );
  }

  async getCutleryFee(
    data: GetCutleryFeeRequest,
  ): Promise<GetCutleryFeeResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_cutlery_fee' }, data),
    );
  }

  async getCouponInfo(
    requestData: GetCouponInfoRequest,
  ): Promise<GetCouponInfoResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_coupon_info' }, requestData),
    );
  }
}
