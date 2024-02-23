import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthenOtpRequest } from '../dto/authen-otp-request.dto';
import { GeneralServiceResponse } from '../dto/general-service-response.dto';
import { VerifyReCaptchaRequest } from '../dto/verify-recaptcha-request.dto';

@Injectable()
export class WebCustomerAuthService {
  @Inject('AUTHORIZATION_SERVICE') private readonly authClient: ClientProxy;
  async requestOTP(phoneNumber: string) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'request_otp' }, phoneNumber),
    );
  }
  async authenticateOTP(data: AuthenOtpRequest) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'authenticate_otp' }, data),
    );
  }
  async refreshToken(user: any) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'refresh_token' }, user),
    );
  }
  async verifyReCAPTCHA(
    data: VerifyReCaptchaRequest,
  ): Promise<GeneralServiceResponse> {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'verify_recaptcha' }, data),
    );
  }
}
