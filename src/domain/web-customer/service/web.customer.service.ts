import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCustomerProfileRequest } from '../dto/create-customer-profile-request.dto';
import { firstValueFrom } from 'rxjs';
import { GenericUser } from 'src/type';

@Injectable()
export class WebCustomerService {
  @Inject('USER_SERVICE') private readonly userClient: ClientProxy;
  getCustomerProfile() {
    return 'customer profile sample';
  }
  async createCustomerProfile(
    requestData: CreateCustomerProfileRequest,
    userData: GenericUser,
  ) {
    return await firstValueFrom(
      this.userClient.send(
        { cmd: 'create_customer_profile' },
        { requestData, userData },
      ),
    );
  }
}
