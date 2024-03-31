import { Inject, Injectable } from '@nestjs/common';
import { GetTopReviewResponse } from '../dto/get-top-review-response.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { GetReviewFormRequest } from '../dto/get-review-form-request';
import { CreateOrderReviewRequestDto } from '../dto/create-review-request.dto';

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

  async getReviewForm(getReviewForm: GetReviewFormRequest): Promise<any> {
    return await lastValueFrom(
      this.restaurantService.send({ cmd: 'get_review_form' }, getReviewForm),
    );
  }

  async createReviewForm(
    reviewForm: CreateOrderReviewRequestDto,
  ): Promise<any> {
    return await lastValueFrom(
      this.restaurantService.send({ cmd: 'create_review_form' }, reviewForm),
    );
  }
}
