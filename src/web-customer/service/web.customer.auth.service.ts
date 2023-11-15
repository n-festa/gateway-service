import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthenOtpRequest } from '../dto/authenOtpRequest.dto';

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
}
