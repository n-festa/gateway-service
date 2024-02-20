import { Module } from '@nestjs/common';
import { AhamoveController } from './ahamove.controller';
import { AhamoveService } from './ahamove.service';

@Module({
  controllers: [AhamoveController],
  providers: [AhamoveService]
})
export class AhamoveModule {}
