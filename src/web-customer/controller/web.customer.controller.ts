import { Controller, Get, UseGuards } from '@nestjs/common';
import { WebCustomerService } from '../service/web.customer.service';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@Controller('web-customer')
@UseGuards(AccessTokenGuard, RolesGuard)
export class WebCustomerController {
  constructor(private readonly webCustomerService: WebCustomerService) {}

  @Roles(Role.Customer)
  @Get('customer-profile')
  getCustomerProfile() {
    return this.webCustomerService.getCustomerProfile();
  }
}
