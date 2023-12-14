import { Global, Module } from '@nestjs/common';
import { FlagsmitService } from './flagsmith.service';
import { ConfigService } from '@nestjs/config';
import { FlagsmithController } from './flagsmith.controller';
import { ClientProxy } from '@nestjs/microservices';

@Global()
@Module({
  imports: [],
  controllers: [FlagsmithController],
  providers: [
    {
      provide: 'FLAGSMITH_SERVICE',
      useFactory: async (
        configService: ConfigService,
        restaurantClient: ClientProxy,
      ) => {
        const flagsmithService = new FlagsmitService(
          configService,
          restaurantClient,
        );
        await flagsmithService.init();
        return flagsmithService;
      },
      inject: [ConfigService, 'RESTAURANT_SERVICE'],
    },
  ],
  exports: ['FLAGSMITH_SERVICE'],
})
export class FlagsmithModule {}
