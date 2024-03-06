import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCustomerProfileRequest } from '../dto/create-customer-profile-request.dto';
import { firstValueFrom } from 'rxjs';
import { GenericUser } from 'src/type';
import { UpdateCustomerProfileRequest } from '../dto/update-customer-profile-request.dto';
import { UpdateProfileImageRequest } from '../dto/update-profile-image-request.dto copy';

@Injectable()
export class WebCustomerService {
  @Inject('USER_SERVICE') private readonly userClient: ClientProxy;
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
  async getCustomerProfile(id: number) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'get_customer_profile' }, id),
    );
  }
  async updateCustomerProfile(requestData: UpdateCustomerProfileRequest) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'update_customer_profile' }, { requestData }),
    );
  }
  async uploadImage(fileName: string, file: Buffer) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'upload_image' }, { fileName, file }),
    );
  }
  async updateProfileImage(requestData: UpdateProfileImageRequest) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'update_profile_image' }, { requestData }),
    );
  }
}
