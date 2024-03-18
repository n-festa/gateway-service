import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WebCustomerRestaurantService } from '../service/web.customer.restaurant.service';
import { RestaurantRecommendationRequest } from '../dto/restaurant-recommendation-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';
import { GetRestaurantDetailResponse } from '../dto/get-restaurant-detail-response.dto';
import { GetRestaurantDetailRequest } from '../dto/get-restaurant-detail-request.dto';
import { FetchMode } from 'src/enum';
import { RestaurantRecommendationResponse } from '../dto/restaurant-recommendation-response.dto';
import { SendContactFormRequest } from '../dto/send-contact-form-request.dto';
import { SendContactFormResponse } from '../dto/send-contact-form-response.dto';
import { WebCustomerAuthService } from '../service/web.customer.auth.service';
import { VerifyReCaptchaRequest } from '../dto/verify-recaptcha-request.dto';
import { VerifyReCaptchaResponse } from '../dto/verify-recaptcha-response.dto';
import { GateWayBadRequestException } from 'src/shared/exceptions/gateway-bad-request.exception';
import { GeneralErrorResponse } from 'src/shared/dtos/general-error-response.dto';
import { AhamoveService } from 'src/dependency/ahamove/ahamove.service';

@ApiTags('Web customer restaurant')
@Controller('web-customer/restaurant')
export class WebCustomerRestaurantController {
  constructor(
    private readonly restaurantService: WebCustomerRestaurantService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
    private readonly authService: WebCustomerAuthService,
    private readonly ahamoveService: AhamoveService,
  ) {}

  @Get('get-general-recomendation')
  async getGeneralRestaurantRecomendation(
    // @Body() requestData: RestaurantRecommendationRequest,
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('fetch_mode') fetch_mode: FetchMode = FetchMode.Some,
  ): Promise<RestaurantRecommendationResponse> {
    const data: RestaurantRecommendationRequest = {
      lat: lat,
      long: long,
      fetch_mode: fetch_mode,
    };
    const res =
      await this.restaurantService.getGeneralRestaurantRecomendation(data);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  } // end of getGeneralRestaurantRecomendation

  @Get('get-detail/:id')
  async getRestaurantDetails(
    @Param('id') id: number,
    @Query('lat') lat: number,
    @Query('long') long: number,
  ): Promise<GetRestaurantDetailResponse> {
    const res = new GetRestaurantDetailResponse(200, '');
    const resquestData: GetRestaurantDetailRequest = {
      restaurant_id: id,
      lat: lat,
      long: long,
    };
    const serviceRes =
      await await this.restaurantService.getRestaurantDetails(resquestData);
    if (serviceRes.statusCode >= 400) {
      throw new HttpException(serviceRes, serviceRes.statusCode);
    }
    res.statusCode = serviceRes.statusCode;
    res.message = serviceRes.message;
    res.data = serviceRes.data;
    return res;
  } // end of getRestaurantDetails

  @Post('send-contact-form')
  @HttpCode(200)
  async sendContactForm(
    @Body() data: SendContactFormRequest,
  ): Promise<SendContactFormResponse> {
    const reCaptchaRequestData: VerifyReCaptchaRequest = {
      verified_token: data.recaptcha_token,
    };
    const verifyReCaptchaResult =
      await this.authService.verifyReCAPTCHA(reCaptchaRequestData);

    if (verifyReCaptchaResult.statusCode != 200) {
      throw new HttpException(
        verifyReCaptchaResult.data,
        verifyReCaptchaResult.statusCode,
      );
    }

    const verifyReCaptchaResultData: VerifyReCaptchaResponse =
      verifyReCaptchaResult.data;

    if (!verifyReCaptchaResultData.success) {
      throw new GateWayBadRequestException(
        new GeneralErrorResponse(1, verifyReCaptchaResultData['error-codes']),
      );
    }

    const sendContactResult =
      await this.restaurantService.sendContactForm(data);
    if (sendContactResult.statusCode == 200) {
      return sendContactResult.data;
    } else if (sendContactResult.statusCode >= 400) {
      throw new HttpException(
        sendContactResult.data,
        sendContactResult.statusCode,
      );
    }
  } //end of sendContactForm

  @Post('estimate')
  getEstimateFee(@Body() coordinates) {
    return this.ahamoveService.estimatePrice(coordinates);
  }

  @Post('order')
  postAhamoveOrder(@Body() order) {
    return this.ahamoveService.postAhamoveOrder(order);
  }
}
