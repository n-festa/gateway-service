import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenRequest } from '../dto/CreateTokenRequest.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebCustomerAuthService {
  @Inject('AUTHORIZATION_SERVICE') private readonly authClient: ClientProxy;
  async createToken(createTokenRequest: CreateTokenRequest) {
    const data: any = await firstValueFrom(
      this.authClient.send(
        { cmd: 'create_token' },
        createTokenRequest.phoneNumber,
      ),
    );
    return data;
    // return this.authClient.send(
    //   { cmd: 'create_token' },
    //   createTokenRequest.phoneNumber,
    // );
  }
  async requestOTP(phoneNumber: string) {
    return await firstValueFrom(
      this.authClient.send({ cmd: 'request_otp' }, phoneNumber),
    );
  }
}
