import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WebCustomerCategoryService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: ClientProxy,
  ) {}
  async getCategories() {
    return await lastValueFrom(
      this.restaurantService.send({ cmd: 'get_categories' }, {}),
    );
  }
}
