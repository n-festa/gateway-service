import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebCustomerRatingAndReviewService } from '../service/web.customer.rating&review.service';
import { GetTopReviewResponse } from '../dto/get-top-review-response.dto';
import { AwsService } from 'src/dependency/aws/aws.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { UploadReviewFileResponse } from '../dto/upload-review-files-response.dto';
import { GetReviewFormRequest } from '../dto/get-review-form-request';
import { Param } from '@nestjs/common';
import { User } from 'src/decorator/user.decorator';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { GenericUser } from 'src/type';
import { OrderDetailResponse } from '../dto/order-detail-response.dto';
import { CreateOrderReviewRequestDto } from '../dto/create-review-request.dto';

@ApiTags('Rating And Review')
@Controller('/web-customer/rating-review')
export class WebCustomerRatingAndReviewController {
  CLOUDFRONT_DISTRIBUTION_DOMAIN = 'https://d2h6tnle5tppss.cloudfront.net';
  AWS_S3_URL = 'https://2all-content.s3.ap-southeast-2.amazonaws.com';
  constructor(
    private readonly s3Service: AwsService,
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

  @Get('get-review-form')
  async getReviewForm(
    @Body() getReviewForm: GetReviewFormRequest,
    @User() user: GenericUser,
  ): Promise<GetTopReviewResponse> {
    const res = new GetTopReviewResponse(200, '');
    if (user.userId !== getReviewForm.customer_id) {
      throw new UnauthorizedException(
        "Cannot update item to other customer's cart",
      );
    }
    const serviceRes =
      await this.ratingAndReviewService.getReviewForm(getReviewForm);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }
    res.message = serviceRes.message;
    res.data = serviceRes.data;
    res.statusCode = serviceRes.statusCode;

    return res;
  } //end of getTopReview

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadFile(
    @Query('orderId') orderId,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    const bucketName = '2all-content';
    const uploadedFileURLs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (!this.s3Service.isImageType(file.mimetype)) {
        throw new BadRequestException('Uploaded file is not an image');
      }
      const fileName = ` order_${orderId}_${uuidv4()}`;

      // Check if the file is an image
      if (file.mimetype.startsWith('image/')) {
        uploadedFileURLs.push(
          await this.s3Service.resizeAndUploadToS3(
            bucketName,
            fileName,
            file.buffer,
          ),
        );
      }
    }
    const res = new UploadReviewFileResponse(200, '');

    res.message = 'Files successfully uploaded';
    res.data = {
      urls: uploadedFileURLs.map((url) =>
        url.replaceAll(this.AWS_S3_URL, this.CLOUDFRONT_DISTRIBUTION_DOMAIN),
      ),
    };
    res.statusCode = 201;

    return res;
  }

  @Post('create')
  async getOrderDetail(
    @Body() reviewRequest: CreateOrderReviewRequestDto,
    @User() user: GenericUser,
  ): Promise<any> {
    try {
      if (user.userId !== reviewRequest.customer_id) {
        throw new UnauthorizedException(
          "Cannot update item to other customer's cart",
        );
      }
      const serviceRes =
        await this.ratingAndReviewService.createReviewForm(reviewRequest);
      return serviceRes;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }
  }
}
