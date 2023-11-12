import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebCustomerModule } from './web-customer/web-customer.module';

@Module({
  imports: [WebCustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
