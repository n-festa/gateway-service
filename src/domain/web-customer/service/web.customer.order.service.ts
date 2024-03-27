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
import { ApplyPromotionCodeRequest } from '../dto/apply-promotion-code-request.dto';
import { ApplyPromotionCodeResponse } from '../dto/apply-promotion-code-response.dto';
import { CreateOrderRequest } from '../dto/create-order-request.dto';
import { CreateOrderResponse } from '../dto/create-order-response.dto';
import { OrderDetailResponse } from '../dto/order-detail-response.dto';
import { GetDeliveryFeeRequest } from '../dto/get-delivery-fee-request.dto';
import { GetDeliveryFeeResonse } from '../dto/get-delivery-fee-response.dto';
import { GetOngoingOrdersResponse } from '../dto/get-ongoing-orders-response.dto';
import { GetOrderHistoryByRestaurantRequest } from '../dto/get-order-history-by-restaurant-request.dto';
import { GetOrderHistoryByRestaurantResponse } from '../dto/get-order-history-by-restaurant-response.dto';

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

  async applyCoupon(
    requestData: ApplyPromotionCodeRequest,
  ): Promise<ApplyPromotionCodeResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'apply_promotion_code' }, requestData),
    );
  }

  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'create_order' }, data),
    );
  }

  async getOrderDetail(
    order_id: number,
    customer_id: number,
  ): Promise<OrderDetailResponse> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_order_detail' },
        { order_id, customer_id },
      ),
    );
  }

  async getDeliveryFee(
    data: GetDeliveryFeeRequest,
  ): Promise<GetDeliveryFeeResonse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_delivery_fee' }, data),
    );
  }

  async getOrderById(orderId) {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_order_by_id' }, orderId),
    );
  }

  async getOrderDetailSse(order_id: number): Promise<OrderDetailResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_order_detail_sse' }, { order_id }),
    );
  }

  async changeOrderStatusForTesting(data: any) {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'change_order_status_for_testing' },
        data,
      ),
    );
  }

  async getCustomerOngoingOrders(
    customer_id: number,
  ): Promise<GetOngoingOrdersResponse> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_customer_ongoing_orders' },
        customer_id,
      ),
    );
  }

  async getOrderHistoryByRestaurant(
    data: GetOrderHistoryByRestaurantRequest,
  ): Promise<GetOrderHistoryByRestaurantResponse> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_order_history_by_restaurant' },
        data,
      ),
    );
  }
}
