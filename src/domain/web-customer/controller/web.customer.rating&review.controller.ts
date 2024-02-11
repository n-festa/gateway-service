import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebCustomerRatingAndReviewService } from '../service/web.customer.rating&review.service';
import { GetTopReviewResponse } from '../dto/get-top-review-response.dto';

@ApiTags('Rating And Review')
@Controller('/web-customer/rating-review')
export class WebCustomerRatingAndReviewController {
  constructor(
    private readonly ratingAndReviewService: WebCustomerRatingAndReviewService,
  ) {}

  @Get('get-top-review')
  async getTopReview(): Promise<GetTopReviewResponse> {
    const res = new GetTopReviewResponse(200, '');

    const serviceRes = await this.ratingAndReviewService.getTopReview();
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }
    res.message = serviceRes.message;
    res.data = serviceRes.data;
    res.statusCode = serviceRes.statusCode;

    return res;
  } //end of getTopReview
}
