import { Module } from '@nestjs/common';
import { AhamoveController } from './ahamove.controller';
import { AhamoveService } from './ahamove.service';
import { WebCustomerModule } from 'src/domain/web-customer/web-customer.module';

@Module({
  controllers: [AhamoveController],
  providers: [AhamoveService],
  imports: [WebCustomerModule],
})
export class AhamoveModule {}
