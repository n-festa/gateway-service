import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { WebCustomerCartService } from '../service/web.customer.cart.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum';
import { AddToCartRequest } from '../dto/add-to-cart-request.dto';
import { AddToCartResponse } from '../dto/add-to-cart-response.dto';
import { User } from 'src/decorator/user.decorator';
import { GenericUser } from 'src/type';
import { UpdateCartRequest } from '../dto/update-cart-request.dto';
import { UpdateCartResponse } from '../dto/update-cart-response.dto';
import { GetCartDetailResponse } from '../dto/get-cart-detail-response.dto';

@ApiTags(' Cart')
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('web-customer/cart')
export class WebCustomerCartController {
  constructor(
    @Inject('FLAGSMITH_SERVICE')
    private readonly flagsmithService: FlagsmitService,
    private readonly cartService: WebCustomerCartService,
  ) {}

  @Post('add')
  @Roles(Role.Customer)
  @HttpCode(200)
  async addCartItem(
    @Body() requestData: AddToCartRequest,
    @User() user: GenericUser,
  ): Promise<AddToCartResponse> {
    if (this.flagsmithService.isFeatureEnabled('fes-24-add-to-cart')) {
      const res = new AddToCartResponse(200, '');
      if (user.userId !== requestData.customer_id) {
        throw new UnauthorizedException(
          "Cannot add item to other customer's cart",
        );
      }
      const serviceRes = await this.cartService.addCartItem(requestData);
      res.statusCode = serviceRes.statusCode;
      res.message = serviceRes.message;
      res.data = serviceRes.data;

      if (res.statusCode >= 400) {
        throw new HttpException(res, res.statusCode);
      }

      return res;
    }
  }

  @Get('get-detail/:customer_id')
  @Roles(Role.Customer)
  async getCartDetail(
    @User() user: GenericUser,
    @Param('customer_id') customer_id: number,
  ): Promise<GetCartDetailResponse> {
    if (this.flagsmithService.isFeatureEnabled('fes-27-get-cart-info')) {
      const res = new GetCartDetailResponse(200, '');
      //Check if user is authorized to get cart info
      if (user.userId !== customer_id) {
        throw new UnauthorizedException(
          "Cannot get other customer's cart info",
        );
      }
      const serviceRes = await this.cartService.getCartDetail(customer_id);

      if (serviceRes.statusCode >= 400) {
        throw new HttpException(serviceRes, serviceRes.statusCode);
      }

      res.statusCode = serviceRes.statusCode;
      res.message = serviceRes.message;
      res.data = serviceRes.data;

      return res;
    }
  }

  @Post('update')
  @Roles(Role.Customer)
  @HttpCode(200)
  async updateCart(
    @User() user: GenericUser,
    @Body() requestData: UpdateCartRequest,
  ): Promise<UpdateCartResponse> {
    if (this.flagsmithService.isFeatureEnabled('fes-28-update-cart')) {
      const res = new UpdateCartResponse(200, '');

      if (user.userId !== requestData.customer_id) {
        throw new UnauthorizedException(
          "Cannot update item to other customer's cart",
        );
      }
      const serviceRes = await this.cartService.updateCart(requestData);
      if (serviceRes.statusCode >= 400) {
        throw new HttpException(serviceRes, serviceRes.statusCode);
      }

      res.statusCode = serviceRes.statusCode;
      res.message = serviceRes.message;
      res.data = serviceRes.data;

      return res;
    }
  }
}
