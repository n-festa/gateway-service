import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { AddToCartRequest } from '../dto/add-to-cart-request.dto';
import { AddToCartResponse } from '../dto/add-to-cart-response.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateCartAdvancedRequest } from '../dto/update-cart-advanced-request.dto';
import { UpdateCartAdvancedResponse } from '../dto/update-cart-advanced-response.dto';
import { GetCartDetailResponse } from '../dto/get-cart-detail-response.dto';
import { UpdateCartBasicRequest } from '../dto/update-cart-basic-request.dto';
import { UpdateCartBasicResponse } from '../dto/update-cart-basic-response.dto';
import { DeleteCartItemRequest } from '../dto/delete-cart-item-request.dto';
import { DeleteCartItemResponse } from '../dto/delete-cart-item-response.dto';
import { GeneralResponse } from '../dto/general-response.dto';

@Injectable()
export class WebCustomerCartService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  async addCartItem(requestData: AddToCartRequest): Promise<AddToCartResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'add_cart_item' }, requestData),
    );
  } // end of addCartItem

  async getCartDetail(customer_id: number): Promise<GetCartDetailResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_cart_detail' }, customer_id),
    );
  } // end of getCartDetail

  async updateCartAdvaced(
    requestData: UpdateCartAdvancedRequest,
  ): Promise<UpdateCartAdvancedResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'update_cart_advanced' }, requestData),
    );
  } // end of updateCartAdvaced

  async updateCartBasic(
    requestData: UpdateCartBasicRequest,
  ): Promise<UpdateCartBasicResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'update_cart_basic' }, requestData),
    );
  } // end of updateCartBasic

  async deleteCartItems(
    data: DeleteCartItemRequest,
  ): Promise<DeleteCartItemResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'delete_cart_items' }, data),
    );
  } // end of deleteCartItems

  async deleteAllCartItem(customer_id: number): Promise<GeneralResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'delete_all_cart_item' }, customer_id),
    );
  } // end of deleteAllCartItem
}
