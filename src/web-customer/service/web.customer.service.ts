import { Injectable } from '@nestjs/common';

@Injectable()
export class WebCustomerService {
  getCustomerProfile() {
    return 'customer profile sample';
  }
}
