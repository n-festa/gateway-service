import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebCustomerRatingAndReviewService } from '../service/web.customer.rating&review.service';
import { GetTopReviewResponse } from '../dto/get-top-review-response.dto';
import { AwsService } from 'src/dependency/aws/aws.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { UploadReviewFileResponse } from '../dto/upload-review-files-response.dto';
import { GetReviewFormRequest } from '../dto/get-review-form-request.dto';
import { User } from 'src/decorator/user.decorator';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { GenericUser } from 'src/type';
import { CreateOrderReviewRequestDto } from '../dto/create-review-request.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum';
import { DefinedFileTypeValidation } from 'src/shared/validations/defined-file-type-validation.exception';
import { ConfigService } from '@nestjs/config';
import { GetReviewFormResponse } from '../dto/get-review-form-response.dto';
import { CreateOrderReviewResponse } from '../dto/create-review-response.dto';

@ApiTags('Rating And Review')
@Controller('/web-customer/rating-review')
export class WebCustomerRatingAndReviewController {
  // CLOUDFRONT_DISTRIBUTION_DOMAIN = 'https://d2h6tnle5tppss.cloudfront.net';
  // AWS_S3_URL = 'https://2all-content.s3.ap-southeast-2.amazonaws.com';
  constructor(
    private readonly s3Service: AwsService,
    private readonly ratingAndReviewService: WebCustomerRatingAndReviewService,
    private readonly configService: ConfigService,
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

  @Get('get-form')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Customer)
  async getReviewForm(
    @Body() getReviewForm: GetReviewFormRequest,
    @User() user: GenericUser,
  ): Promise<GetReviewFormResponse> {
    // const res = new GetTopReviewResponse(200, '');
    if (user.userId !== getReviewForm.customer_id) {
      throw new GateWayBadRequestException({
        error_code: 2,
        detail: "Cannot get other customer's data",
      });
    }
    try {
      const res =
        await this.ratingAndReviewService.getReviewForm(getReviewForm);
      return res;
    } catch (error) {
      if (error?.error_code) {
        throw new GateWayBadRequestException(error);
      } else {
        throw new HttpException(error, 500);
      }
    }

    // const serviceRes =
    //   await this.ratingAndReviewService.getReviewForm(getReviewForm);
    // if (serviceRes.statusCode >= 400) {
    //   throw new HttpException(serviceRes, serviceRes.statusCode);
    // }
    // res.message = serviceRes.message;
    // res.data = serviceRes.data;
    // res.statusCode = serviceRes.statusCode;

    // return res;
  }

  @Post('upload-images')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files', 3))
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Customer)
  async uploadFile(
    @Query('orderId') orderId,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'File size must be equal or less than 5MB',
          }),
          new DefinedFileTypeValidation({
            fileType: /^(image[/])+(jpg|jpeg|png|gif|bmp|tiff)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<any> {
    const BUCKET_NAME = '2all-content';
    const FOLDER_NAME = 'review';
    const CLOUDFRONT_DISTRIBUTION_DOMAIN = this.configService.get(
      'awsS3.cloudfrontDistributionDomain',
    );
    const uploadedFileURLs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // if (!file) {
      //   // throw new BadRequestException('No file uploaded');
      //   throw new GateWayBadRequestException({
      //     error_code: 2,
      //     detail: 'No file uploaded',
      //   });
      // }

      // if (!this.s3Service.isImageType(file.mimetype)) {
      //   // throw new BadRequestException('Uploaded file is not an image');
      //   throw new GateWayBadRequestException({
      //     error_code: 3,
      //     detail: 'File type must be jpg, jpeg, png, gif, bmp or tiff',
      //   });
      // }
      const fileName = ` order_${orderId}_${uuidv4()}`;

      // Check if the file is an image
      if (file.mimetype.startsWith('image/')) {
        const uploadedFileKey = await this.s3Service.resizeAndUploadToS3(
          BUCKET_NAME,
          FOLDER_NAME,
          fileName,
          file.mimetype,
          file.buffer,
        );
        uploadedFileURLs.push(
          `${CLOUDFRONT_DISTRIBUTION_DOMAIN}/${uploadedFileKey}`,
        );
      }
    }
    // const res = new UploadReviewFileResponse(200, '');

    // res.message = 'Files successfully uploaded';
    // res.data = {
    //   urls: uploadedFileURLs.map((url) =>
    //     url.replaceAll(this.AWS_S3_URL, this.CLOUDFRONT_DISTRIBUTION_DOMAIN),
    //   ),
    // };
    // res.statusCode = 201;

    const res: UploadReviewFileResponse = {
      urls: uploadedFileURLs,
    };

    return res;
  }

  @Post('create')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Customer)
  async getOrderDetail(
    @Body() reviewRequest: CreateOrderReviewRequestDto,
    @User() user: GenericUser,
  ): Promise<CreateOrderReviewResponse> {
    try {
      if (user.userId !== reviewRequest.customer_id) {
        // throw new UnauthorizedException(
        //   "Cannot update item to other customer's cart",
        // );
        throw new GateWayBadRequestException({
          error_code: 2,
          detail: "Cannot get other customer's data",
        });
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
