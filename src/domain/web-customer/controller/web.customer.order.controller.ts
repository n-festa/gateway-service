import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { WebCustomerOrderService } from '../service/web.customer.order.service';
import { Roles } from 'src/decorator/roles.decorator';
import { GetApplicationFeeRequest } from '../dto/get-application-fee-request.dto';
import { Role } from 'src/enum';
import { GetApplicationFeeResponse } from '../dto/get-application-fee-response.dto';
import { GetPaymentMethodResponse } from '../dto/get-payment-method-response.dto';
import { Public } from 'src/decorator/public.decorator';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { GetCutleryFeeRequest } from '../dto/get-cutlery-fee-request.dto';
import { GetCutleryFeeResponse } from '../dto/get-cutlery-fee-response.dto';
import { GetCouponInfoRequest } from '../dto/get-coupon-info-request.dto';
import { GetCouponInfoResponse } from '../dto/get-coupon-info-response.dto';
import { ApplyPromotionCodeRequest } from '../dto/apply-promotion-code-request.dto';
import { ApplyPromotionCodeResponse } from '../dto/apply-promotion-code-response.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateOrderRequest } from '../dto/create-order-request.dto';
import { CreateOrderResponse } from '../dto/create-order-response.dto';
import { User } from 'src/decorator/user.decorator';
import { GenericUser } from 'src/type';
import { OrderDetailResponse } from '../dto/order-detail-response.dto';

@ApiTags('Order')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('web-customer/order')
@Controller()
export class WebCustomerOrderController {
  constructor(private readonly orderService: WebCustomerOrderService) {}

  @Post('get-application-fee')
  @SkipThrottle({ default: true })
  @Roles(Role.Customer)
  @HttpCode(200)
  async getApplicationFee(
    @Body() requestData: GetApplicationFeeRequest,
  ): Promise<GetApplicationFeeResponse> {
    try {
      const res = await this.orderService.getApplicationFee(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new HttpException(error, 400);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
  @Get('get-payment-method')
  @Public()
  async getPaymentMethod(): Promise<GetPaymentMethodResponse> {
    try {
      const res = await this.orderService.getPaymentMethod();
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new HttpException(error, 400);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('get-cutlery-fee')
  @SkipThrottle({ default: true })
  @Public()
  @HttpCode(200)
  async getCutleryFee(
    @Body() requestData: GetCutleryFeeRequest,
  ): Promise<GetCutleryFeeResponse> {
    try {
      const res = await this.orderService.getCutleryFee(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('get-coupon-info')
  @Roles(Role.Customer)
  @HttpCode(200)
  async getCouponInfo(
    @Body() requestData: GetCouponInfoRequest,
  ): Promise<GetCouponInfoResponse> {
    try {
      const res = await this.orderService.getCouponInfo(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('apply-coupon')
  @Roles(Role.Customer)
  @HttpCode(200)
  async applyCoupon(
    @Body() requestData: ApplyPromotionCodeRequest,
  ): Promise<ApplyPromotionCodeResponse> {
    try {
      const res = await this.orderService.applyCoupon(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('create')
  @Roles(Role.Customer)
  @HttpCode(200)
  async createOrder(
    @Body() requestData: CreateOrderRequest,
    @User() user: GenericUser,
  ): Promise<CreateOrderResponse> {
    if (user.userId !== requestData.customer_id) {
      throw new GateWayBadRequestException({
        error_code: 2,
        detail: 'Cannot create an order for other customer',
      });
    }
    try {
      const res = await this.orderService.createOrder(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Get(':order_id')
  @Roles(Role.Customer)
  async getOrderDetail(
    @Param('order_id') order_id: number,
    @User() user: GenericUser,
  ): Promise<OrderDetailResponse> {
    try {
      const res = await this.orderService.getOrderDetail(order_id, user.userId);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
}
