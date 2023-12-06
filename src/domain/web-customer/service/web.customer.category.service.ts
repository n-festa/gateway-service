import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SearchByCategory } from '../dto/search-by-category-request.dto';

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
  async searchFoodAndRestaurantByCategory(data: SearchByCategory) {
    return await lastValueFrom(
      this.restaurantService.send(
        { cmd: 'search_food_and_restaurant_by_category' },
        data,
      ),
    );
  }
}
