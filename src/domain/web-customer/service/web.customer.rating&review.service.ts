import { Inject, Injectable } from '@nestjs/common';
import { GetTopReviewResponse } from '../dto/get-top-review-response.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WebCustomerRatingAndReviewService {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: ClientProxy,
  ) {}
  async getTopReview(): Promise<GetTopReviewResponse> {
    return await lastValueFrom(
      this.restaurantService.send({ cmd: 'get_top_review' }, {}),
    );
  }
}
