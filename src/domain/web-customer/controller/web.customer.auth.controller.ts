import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WebCustomerAuthService } from '../service/web.customer.auth.service';
import { OtpRequest } from '../dto/otp-request.dto';
import { AuthenOtpRequest } from '../dto/authen-otp-request.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { User } from 'src/decorator/user.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyReCaptchaResponse } from '../dto/verify-recaptcha-response.dto';
import { VerifyReCaptchaRequest } from '../dto/verify-recaptcha-request.dto';

@ApiTags('Web customer authentication')
@Controller('web-customer/auth')
export class WebCustomerAuthController {
  constructor(private readonly authService: WebCustomerAuthService) {}

  @ApiResponse({ status: HttpStatus.OK })
  @Post('request-otp')
  @HttpCode(200)
  async requestOTP(@Body() otpRequest: OtpRequest) {
    const res = await this.authService.requestOTP(otpRequest.phoneNumber);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post('authenticate-otp')
  @HttpCode(200)
  async authenticateOTP(@Body() resData: AuthenOtpRequest) {
    const res = await this.authService.authenticateOTP(resData);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Get('refresh-token')
  async refreshToken(@User() user: any) {
    const res = await this.authService.refreshToken(user);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(200)
  @Post('verify-reCAPTCHA')
  async verifyReCAPTCHA(
    @Body() body: VerifyReCaptchaRequest,
  ): Promise<VerifyReCaptchaResponse> {
    const res = await this.authService.verifyReCAPTCHA(body.verified_token);
    if (res.statusCode == 200) {
      return res.data;
    }
  }
}
