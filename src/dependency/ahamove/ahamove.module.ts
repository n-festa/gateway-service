import { Module, forwardRef } from '@nestjs/common';
import { AhamoveController } from './ahamove.controller';
import { AhamoveService } from './ahamove.service';
import { WebCustomerModule } from 'src/domain/web-customer/web-customer.module';

@Module({
  controllers: [AhamoveController],
  providers: [AhamoveService],
  imports: [forwardRef(() => WebCustomerModule)],
  exports: [AhamoveService],
})
export class AhamoveModule {}
