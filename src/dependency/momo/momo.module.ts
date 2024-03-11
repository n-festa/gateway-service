import { Module } from '@nestjs/common';
import { MomoController } from './momo.controller';
import { MomoService } from './momo.service';
import { WebCustomerModule } from 'src/domain/web-customer/web-customer.module';

@Module({
  controllers: [MomoController],
  providers: [MomoService],
  imports: [WebCustomerModule],
})
export class MomoModule {}
