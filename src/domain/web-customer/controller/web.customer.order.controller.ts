import {
  Body,
  Controller,
  HttpCode,
  HttpException,
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

@ApiTags(' Cart')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('web-customer/order')
@Controller()
export class WebCustomerOrderController {
  constructor(private readonly orderService: WebCustomerOrderService) {}

  @Post('get-application-fee')
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
}
