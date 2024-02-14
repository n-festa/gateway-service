import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { GetRestaurantDetailResponse } from '../dto/get-restaurant-detail-response.dto';
import { GetRestaurantDetailRequest } from '../dto/get-restaurant-detail-request.dto';
import { RestaurantRecommendationResponse } from '../dto/restaurant-recommendation-response.dto';
import { SendContactFormRequest } from '../dto/send-contact-form-request.dto';
import { SendContactFormResponse } from '../dto/send-contact-form-response.dto';

@Injectable()
export class WebCustomerRestaurantService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantClient: ClientProxy,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}

  async getGeneralRestaurantRecomendation(
    data: RestaurantRecommendationRequest,
  ): Promise<RestaurantRecommendationResponse> {
    return await firstValueFrom(
      this.restaurantClient.send(
        { cmd: 'get_general_restaurant_recomendation' },
        data,
      ),
    );
  } // end of getGeneralRestaurantRecomendation

  async getRestaurantDetails(
    data: GetRestaurantDetailRequest,
  ): Promise<GetRestaurantDetailResponse> {
    return await firstValueFrom(
      this.restaurantClient.send({ cmd: 'get_restaurant_details' }, data),
    );
  } // end of getRestaurantDetails

  async sendContactForm(
    data: SendContactFormRequest,
  ): Promise<SendContactFormResponse> {
    return await lastValueFrom(
      this.restaurantClient.send({ cmd: 'send_contact_form' }, data),
    );
  } // end of sendContactForm
}
