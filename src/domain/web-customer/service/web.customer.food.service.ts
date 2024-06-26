import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FoodRecommendationRequest } from '../dto/food-recommendation-request.dto';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { SearchFoodByNameRequest } from '../dto/search-food-by-name-request.dto';
import { GetSideDishRequest } from '../dto/get-side-dish-request.dto';
import { GetSideDishResonse } from '../dto/get-side-dish-response.dto';
import { FoodRecommendationResponse } from '../dto/food-recommendation-response.dto';
import { GetFoodDetailResponse } from '../dto/get-food-detail-response.dto';
import { GetHotFoodResponse } from '../dto/get-hot-food-response.dto';
import { GetAvailableFoodByRestaurantResponse } from '../dto/get-available-food-by-restaurant-response.dto';
import { GetAvailableFoodByRestaurantRequest } from '../dto/get-available-food-by-restaurant-request.dto';
import { GetSimilarFoodQuery } from '../dto/get-similar-food-query.dto';
import { GetSimilarFoodResponse } from '../dto/get-similar-food-response.dto';
import { SearchFoodRequest } from '../dto/search-food-request.dto';
import { SearchFoodResponse } from '../dto/search-food-response.dto';

@Injectable()
export class WebCustomerFoodService {
  @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy;
  @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService;
  async getGeneralFoodRecomendation(
    data: FoodRecommendationRequest,
  ): Promise<FoodRecommendationResponse> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_food_recomendation' },
        data,
      ),
    );
  } // end of getGeneralFoodRecomendation

  async searchByName(data: SearchFoodByNameRequest): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'search_food_by_name' }, data),
    );
  } // end of searchByName

  async getFoodDetailById(id: number): Promise<GetFoodDetailResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_food_detail_by_id' }, id),
    );
  } // end of getFoodDetailById

  async getListOfSkuById(id: number): Promise<any> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_list_of_sku_by_id' }, id),
    );
  } // end of getListOfSkuById

  async getSideDishByMenuItemId(
    data: GetSideDishRequest,
  ): Promise<GetSideDishResonse> {
    return await lastValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_side_dish_by_menu_item_id' },
        data,
      ),
    );
  } // end of getSideDishByMenuItemId

  async getHotFood(): Promise<GetHotFoodResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_hot_food' }, {}),
    );
  } // end of getHotFood

  async getAvailableFoodByRestaurant(
    data: GetAvailableFoodByRestaurantRequest,
  ): Promise<GetAvailableFoodByRestaurantResponse> {
    return await lastValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_available_food_by_restaurant' },
        data,
      ),
    );
  } // end of getAvailableFoodByRestaurant

  async getSimilarFood(
    data: GetSimilarFoodQuery,
  ): Promise<GetSimilarFoodResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'get_similar_food' }, data),
    );
  }

  async searchFood(data: SearchFoodRequest): Promise<SearchFoodResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'search_food' }, data),
    );
  }
}
