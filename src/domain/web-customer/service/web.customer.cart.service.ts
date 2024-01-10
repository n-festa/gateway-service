import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { AddToCartRequest } from '../dto/add-to-cart-request.dto';
import { AddToCartResponse } from '../dto/add-to-cart-response.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateCartRequest } from '../dto/update-cart-request.dto';
import { UpdateCartResponse } from '../dto/update-cart-response.dto';

@Injectable()
export class WebCustomerCartService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  async addCartItem(requestData: AddToCartRequest): Promise<AddToCartResponse> {
    if (this.flagService.isFeatureEnabled('fes-24-add-to-cart')) {
      return await lastValueFrom(
        this.restaurantClient.send({ cmd: 'add_cart_item' }, requestData),
      );
    }
  }

  async updateCart(
    requestData: UpdateCartRequest,
  ): Promise<UpdateCartResponse> {
    if (this.flagService.isFeatureEnabled('fes-28-update-cart')) {
      return await lastValueFrom(
        this.restaurantClient.send({ cmd: 'update_cart' }, requestData),
      );
    }
  }
}
