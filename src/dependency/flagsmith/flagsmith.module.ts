import { Global, Module } from '@nestjs/common';
import { FlagsmitService } from './flagsmith.service';
import { ConfigService } from '@nestjs/config';
import { FlagsmithController } from './flagsmith.controller';

@Global()
@Module({
  imports: [],
  controllers: [FlagsmithController],
  providers: [
    {
      provide: 'FLAGSMITH_SERVICE',
      useFactory: async (configService: ConfigService) => {
        const flagsmithService = new FlagsmitService(configService);
        await flagsmithService.init();
        return flagsmithService;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FLAGSMITH_SERVICE'],
})
export class FlagsmithModule {}
