import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Logger,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Res,
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
import { GetDeliveryFeeRequest } from '../dto/get-delivery-fee-request.dto';
import { GetDeliveryFeeResonse } from '../dto/get-delivery-fee-response.dto';
import { MomoService } from 'src/dependency/momo/momo.service';
import { CreateMomoPaymentRequest } from '../dto/create-momo-payment-request.dto';
import { CreateMomoPaymentResponse } from '../dto/create-momo-payment-response.dto';
import { Response } from 'express';
import { Subject } from 'rxjs';
import { EventPattern } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { ChangeOrderStatusForTestingRequest } from '../dto/change-order-status-for-testing-request.dto';

@ApiTags('Order')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('web-customer/order')
@Controller()
export class WebCustomerOrderController {
  constructor(
    private readonly orderService: WebCustomerOrderService,
    private readonly momoService: MomoService,
  ) {}
  private readonly logger = new Logger(WebCustomerOrderController.name);
  /** List of connected clients */
  connectedClients: {
    key: string;
    orderId: number;
    value: { close: () => void; subject: Subject<MessageEvent> };
  }[] = [];

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

  @Post('get-delivery-fee')
  @Public()
  @HttpCode(200)
  async getDeliveryFee(
    @Body() requestData: GetDeliveryFeeRequest,
  ): Promise<GetDeliveryFeeResonse> {
    try {
      const res = await this.orderService.getDeliveryFee(requestData);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('create-momo-payment')
  @Roles(Role.Customer)
  @HttpCode(200)
  async createMomoPayment(
    @Body() payload: CreateMomoPaymentRequest,
  ): Promise<CreateMomoPaymentResponse> {
    try {
      const res = await this.momoService.createMomoPayment(payload);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Get('sse-connection/:order_id')
  @Roles(Role.Customer)
  async createOrderSseConnection(
    @Param(
      'order_id',
      new ParseIntPipe({
        exceptionFactory: (error) =>
          new GateWayBadRequestException({
            error_code: 1,
            detail: error.toString(),
          }),
      }),
    )
    order_id: number,
    @User() user: GenericUser,
    @Res() response: Response,
  ) {
    //Validate Order
    const order = await this.orderService.getOrderById(order_id);
    if (!order) {
      throw new GateWayBadRequestException({
        error_code: 2,
        detail: 'Tracking order is not found',
      });
    }
    if (order.customer_id != user.userId) {
      throw new GateWayBadRequestException({
        error_code: 3,
        detail: "Cannot track other customer's orders",
      });
    }

    const clientKey = uuidv4();

    // Create a subject for this client in which we'll push our data
    const subject = new Subject<MessageEvent>();

    // Create an observer that will take the data pushed to the subject and
    // write it to our connection stream in the right format
    const observer = {
      next: (msg: MessageEvent) => {
        // Called when data is pushed to the subject using subject.next()
        if (msg.type) response.write(`event: ${msg.type}\n`);
        if (msg.id) response.write(`id: ${msg.id}\n`);
        if (msg.retry) response.write(`retry: ${msg.retry}\n`);
        response.write(`data: ${JSON.stringify(msg.data)}\n\n`);
      },
      complete: () => {
        this.logger.log(`observer ${clientKey} complete`);
      },
      error: (err: any) => {
        console.log(`observer ${clientKey} get error: ${err}`);
      },
    };

    // Attach the observer to the subject
    subject.subscribe(observer);

    // Add the client to our client list
    this.logger.log('Establist connection with client ' + clientKey);
    this.connectedClients.push({
      key: clientKey,
      orderId: order_id,
      value: {
        close: () => {
          response.end();
        }, // Will allow  us to close the connection if needed
        subject, // Subject related to this client
      },
    });

    //Handle connection closed
    response.on('close', () => {
      this.logger.log('Connection closed for client ' + clientKey);
      subject.complete(); //End the observable stream
      //Remove client from the list
      const connectedClientIndex = this.connectedClients.findIndex(
        (i) => i.key == clientKey,
      );
      this.connectedClients.splice(connectedClientIndex, 1);
      response.end(); // Close connection
    });

    //Send header to establish SEE connection
    response.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no', // Disable buffering for SSE
    });
    response.write(`data: {"clientId": "${clientKey}"} \n\n`);
    response.flushHeaders();

    // From this point, the connection with the client is established.
    // We can send data using the subject.next(MessageEvent) function.
  }

  @EventPattern('order_updated')
  @Public()
  async sendOrderDataToClient(payload) {
    this.logger.log('sendOrderDataToClient', payload);
    const { order_id } = payload;

    const orderDetail = await this.orderService.getOrderDetailSse(order_id);

    const message: MessageEvent = {
      data: orderDetail,
    };
    this.connectedClients
      .filter((i) => i.orderId == order_id)
      .forEach((client) => {
        client.value.subject.next(message);
      });
    return '';
  }

  @Post('change-status')
  @Public()
  @HttpCode(200)
  async changeOrderStatusForTesting(
    @Body() payload: ChangeOrderStatusForTestingRequest,
  ) {
    try {
      const res = await this.orderService.changeOrderStatusForTesting(payload);
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
