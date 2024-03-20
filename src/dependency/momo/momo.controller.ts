import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { MomoService } from './momo.service';
@Controller('momo')
export class MomoController {
  private readonly logger = new Logger(MomoController.name);
  constructor(private readonly momoService: MomoService) {}
  // @Post('')
  // async createMomoPayment(@Body() payload: any) {
  //   return this.momoService.createMomoPayment(payload);
  // }

  @Post('momo-ipn-callback')
  async momoCallbacksUr1l(@Req() req: Request, @Res() res: Response) {
    this.logger.verbose('ipn-post', JSON.stringify(req.body));
    try {
      await this.momoService.momoIpnCallback(req.body);
      res.sendStatus(204);
    } catch (error) {
      this.logger.error('ipn-post-error', JSON.stringify(error));
      return { message: 'Error when handle' };
    }
  }
}
