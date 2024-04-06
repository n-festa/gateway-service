import {
  Body,
  Controller,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WebRestaurantService } from './web-restaurant.service';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { CreateMenuItemRequest } from './dto/create-menu-item-request.dto';
import { CreateMenuItemResponse } from './dto/create-menu-item-response.dto';

@Controller('web-restaurant')
export class WebRestaurantController {
  constructor(private readonly generalService: WebRestaurantService) {}

  @Post('confirm-oder/:order_id')
  async confirmOrder(
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
    @Body() payload: any,
  ) {
    const { secret_key } = payload;

    if (secret_key !== '2all') {
      throw new GateWayBadRequestException({
        error_code: 2,
        detail: 'Secret Key is invalid',
      });
    }
    try {
      const res = await this.generalService.confirmOrder(order_id);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }

  @Post('create-menu-item')
  async createMenuItem(
    @Body() payload: CreateMenuItemRequest,
  ): Promise<CreateMenuItemResponse> {
    const { secret_key } = payload;

    if (secret_key !== '2all') {
      throw new GateWayBadRequestException({
        error_code: 2,
        detail: 'Secret Key is invalid',
      });
    }
    try {
      const res = await this.generalService.createMenuItem(payload);
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
