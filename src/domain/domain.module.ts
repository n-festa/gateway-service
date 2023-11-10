import { Module } from '@nestjs/common';
import { WebCustomerModule } from './web-customer/web-customer.module';

@Module({
  imports: [WebCustomerModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
