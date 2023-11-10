import { Body, Controller, Post } from '@nestjs/common';
import { WebCustomerAuthService } from '../service/web.customer.auth.service';
import { CreateTokenRequest } from '../dto/CreateTokenRequest.dto';

@Controller()
export class WebCustomerAuthController {
  constructor(private readonly authService: WebCustomerAuthService) {}

  @Post('create-token')
  async createToken(@Body() createTokenRequest: CreateTokenRequest) {
    const data = await this.authService.createToken(createTokenRequest);
    const createTokenResponse = {
      status: 'success',
      data: data,
    };
    return createTokenResponse;
  }
}
