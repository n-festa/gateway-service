import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { SearchFoodByNameRequest } from '../dto/search-food-by-name-request.dto';

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
    if (this.flagService.isFeatureEnabled('fes-12-search-food-by-name')) {
      return await lastValueFrom(
        this.restaurantClient.send({ cmd: 'search_food_by_name' }, data),
      );
    } else {
    }
  }

  async getFoodDetailById(id: number): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_food_detail_by_id' }, id),
    );
  }

  async getListOfSkuById(id: number): Promise<any> {
    if (this.flagService.isFeatureEnabled('fes-16-get-list-of-skus')) {
      return await lastValueFrom(
        this.restaurantClient.send({ cmd: 'get_list_of_sku_by_id' }, id),
      );
    } else {
    }
  }
}
