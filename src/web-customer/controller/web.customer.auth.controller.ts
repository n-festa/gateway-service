import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { WebCustomerAuthService } from '../service/web.customer.auth.service';
import { CreateTokenRequest } from '../dto/CreateTokenRequest.dto';
import { OtpRequest } from '../dto/RequestOTP.dto';
import { AuthenOtpRequest } from '../dto/authenOtpRequest.dto';

@Controller('web-customer-auth')
export class WebCustomerAuthController {
  constructor(private readonly authService: WebCustomerAuthService) {}

  @Post('create-token')
  async createToken(@Body() createTokenRequest: CreateTokenRequest) {
    const data = await this.authService.createToken(createTokenRequest);
    const createTokenResponse = {
      status: 'success',
      data: data,
    };
    return createTokenResponse;
  }

  @Post('request-otp')
  @HttpCode(200)
  async requestOTP(@Body() otpRequest: OtpRequest) {
    const res = await this.authService.requestOTP(otpRequest.phoneNumber);
    if (res.statusCode >= 400) {
      throw new HttpException(res.message, res.statusCode);
    }
    return res;
  }
  @Post('authenticate-otp')
  @HttpCode(200)
  async authenticateOTP(@Body() resData: AuthenOtpRequest) {
    const res = await this.authService.authenticateOTP(resData);
    if (res.statusCode >= 400) {
      throw new HttpException(res.message, res.statusCode);
    }
    return res;
  }
}
