import { Controller, Get, Inject, Param } from '@nestjs/common';
import { FlagsmitService } from './flagsmith.service';

@Controller('feature-flag')
export class FlagsmithController {
  constructor(
    @Inject('FLAGSMITH_SERVICE')
    private readonly flagsmithService: FlagsmitService,
  ) {}

  @Get('refresh')
  async refreshFlags() {
    return await this.flagsmithService.refreshFlags();
  }
  @Get('all')
  async getAllFlags() {
    return this.flagsmithService.flags;
  }
  @Get('activate-identity/:id')
  async activateIdentity(@Param('id') id: string) {
    return this.flagsmithService.activateIdentity(id);
  }
}
