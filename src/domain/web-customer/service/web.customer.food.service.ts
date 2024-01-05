import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { SearchFoodByNameRequest } from '../dto/search-food-by-name-request.dto';
import { GetSideDishRequest } from '../dto/get-side-dish-request.dto';
import { GetSideDishResonse } from '../dto/get-side-dish-response.dto';

@Injectable()
export class WebCustomerFoodService {
  @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy;
  @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService;
  async getGeneralFoodRecomendation(
    data: FoodRecommendationRequest,
  ): Promise<any> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_food_recomendation' },
        data,
      ),
    );
  }

  async searchByName(data: SearchFoodByNameRequest): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'search_food_by_name' }, data),
    );
  }

  async getFoodDetailById(id: number): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_food_detail_by_id' }, id),
    );
  }

  async getListOfSkuById(id: number): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_list_of_sku_by_id' }, id),
    );
  }

  async getSideDishByMenuItemId(
    data: GetSideDishRequest,
  ): Promise<GetSideDishResonse> {
    if (this.flagService.isFeatureEnabled('fes-23-get-side-dishes')) {
      return await lastValueFrom(
        this.restaurantClient.send(
          { cmd: 'get_side_dish_by_menu_item_id' },
          data,
        ),
      );
    }
  }
}
