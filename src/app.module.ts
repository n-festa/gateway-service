import { ExecutionContext, Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebCustomerModule } from './domain/web-customer/web-customer.module';
import { configurationFactory } from './shared/config/configuration-factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FlagsmithModule } from './dependency/flagsmith/flagsmith.module';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AhamoveModule } from './dependency/ahamove/ahamove.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MomoModule } from './dependency/momo/momo.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configurationFactory], // TODO do config validation based on expected schema
    }),
    WebCustomerModule,
    FlagsmithModule,
    AhamoveModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttlerConfig.ttl'),
          limit: config.get('throttlerConfig.limit'),
          skipIf: (ctx: ExecutionContext) => {
            const [req] = ctx.getArgs();
            return req.hostname === 'localhost';
          },
        },
      ],
    }),
    MomoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'RESTAURANT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const options = configService.get('microServices.restaurant');
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
    {
      provide: 'AUTHORIZATION_SERVICE',
      useFactory: (configService: ConfigService) => {
        const options = configService.get('microServices.authorization');
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const options = configService.get('microServices.user');
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: ['RESTAURANT_SERVICE', 'AUTHORIZATION_SERVICE', 'USER_SERVICE'],
})
export class AppModule {}
