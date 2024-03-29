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
import { UpdateCartAdvancedRequest } from '../dto/update-cart-advanced-request.dto';
import { UpdateCartAdvancedResponse } from '../dto/update-cart-advanced-response.dto';
import { GetCartDetailResponse } from '../dto/get-cart-detail-response.dto';
import { UpdateCartBasicRequest } from '../dto/update-cart-basic-request.dto';
import { UpdateCartBasicResponse } from '../dto/update-cart-basic-response.dto';
import { DeleteCartItemRequest } from '../dto/delete-cart-item-request.dto';
import { DeleteCartItemResponse } from '../dto/delete-cart-item-response.dto';
import { GeneralResponse } from '../dto/general-response.dto';
import { GetAvailableDeliveryTimeRequest } from '../dto/get-available-delivery-time-request.dto';
import { GetAvailableDeliveryTimeResponse } from '../dto/get-available-delivery-time-response.dto';
import { QuickAddToCartRequest } from '../dto/quick-add-to-cart-request.dto';
import { QuickAddToCartResponse } from '../dto/quick-add-to-cart-response.dto';
import { SkipThrottle } from '@nestjs/throttler';

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
  @SkipThrottle({ default: true })
  @Roles(Role.Customer)
  @HttpCode(200)
  async addCartItem(
    @Body() requestData: AddToCartRequest,
    @User() user: GenericUser,
  ): Promise<AddToCartResponse> {
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
  } // end of addCartItem

  @Get('get-detail/:customer_id')
  @Roles(Role.Customer)
  async getCartDetail(
    @User() user: GenericUser,
    @Param('customer_id') customer_id: number,
  ): Promise<GetCartDetailResponse> {
    const res = new GetCartDetailResponse(200, '');
    //Check if user is authorized to get cart info
    if (user.userId !== customer_id) {
      throw new UnauthorizedException("Cannot get other customer's cart info");
    }
    const serviceRes = await this.cartService.getCartDetail(customer_id);

    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of getCartDetail

  @Post('advanced-update')
  @Roles(Role.Customer)
  @HttpCode(200)
  async updateCartAdvaced(
    @User() user: GenericUser,
    @Body() requestData: UpdateCartAdvancedRequest,
  ): Promise<UpdateCartAdvancedResponse> {
    const res = new UpdateCartAdvancedResponse(200, '');

    if (user.userId !== requestData.customer_id) {
      throw new UnauthorizedException(
        "Cannot update item to other customer's cart",
      );
    }
    const serviceRes = await this.cartService.updateCartAdvaced(requestData);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of updateCartAdvaced

  @Post('basic-update')
  @Roles(Role.Customer)
  @SkipThrottle({ default: true })
  @HttpCode(200)
  async updateCartBasic(
    @User() user: GenericUser,
    @Body() requestData: UpdateCartBasicRequest,
  ): Promise<UpdateCartBasicResponse> {
    const res = new UpdateCartBasicResponse(200, '');

    if (user.userId !== requestData.customer_id) {
      throw new UnauthorizedException(
        "Cannot update item to other customer's cart",
      );
    }
    const serviceRes = await this.cartService.updateCartBasic(requestData);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of updateCartBasic

  @Post('delelte-item')
  @Roles(Role.Customer)
  @HttpCode(200)
  async deleteCartItems(
    @User() user: GenericUser,
    @Body() requestData: DeleteCartItemRequest,
  ): Promise<DeleteCartItemResponse> {
    const res = new DeleteCartItemResponse(200, '');

    if (user.userId !== requestData.customer_id) {
      throw new UnauthorizedException(
        "Cannot delete item to other customer's cart",
      );
    }
    const serviceRes = await this.cartService.deleteCartItems(requestData);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of deleteCartItems

  @Post('delete-all/:customer_id')
  @Roles(Role.Customer)
  @HttpCode(200)
  async deleteAllCartItem(
    @User() user: GenericUser,
    @Param('customer_id') customer_id: number,
  ): Promise<GeneralResponse> {
    const res = new GeneralResponse(200, '');

    //Check if user is authorized to delete cart
    if (user.userId !== customer_id) {
      throw new UnauthorizedException("Cannot delete other customer's cart");
    }

    const serviceRes = await this.cartService.deleteAllCartItem(customer_id);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of deleteAllCartItem

  @Post('get-available-delivery-time')
  @Roles(Role.Customer)
  @HttpCode(200)
  async getAvailableDeliveryTime(
    @Body() data: GetAvailableDeliveryTimeRequest,
  ): Promise<GetAvailableDeliveryTimeResponse> {
    const res = new GetAvailableDeliveryTimeResponse(200, '');
    const serviceRes = await this.cartService.getAvailableDeliveryTime(data);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }

    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    return res;
  } // end of getAvailableDeliveryTime

  @Post('quick-add')
  @Roles(Role.Customer)
  @HttpCode(200)
  async quickAddToCart(
    @Body() requestData: QuickAddToCartRequest,
    @User() user: GenericUser,
  ): Promise<QuickAddToCartResponse> {
    const res = new QuickAddToCartResponse(200, '');
    if (user.userId !== requestData.customer_id) {
      throw new UnauthorizedException(
        "Cannot add item to other customer's cart",
      );
    }
    const serviceRes = await this.cartService.quickAddToCart(requestData);
    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;

    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }

    return res;
  } // end of quickAddToCart
}
