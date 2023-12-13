import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebCustomerModule } from './domain/web-customer/web-customer.module';
import { configurationFactory } from './shared/config/configuration-factory';
import { ConfigModule } from '@nestjs/config';
import { FlagsmithModule } from './dependency/flagsmith/flagsmith.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configurationFactory], // TODO do config validation based on expected schema
    }),
    WebCustomerModule,
    FlagsmithModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
