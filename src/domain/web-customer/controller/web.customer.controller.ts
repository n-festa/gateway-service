import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Put
} from '@nestjs/common';
import { WebCustomerService } from '../service/web.customer.service';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { CreateCustomerProfileRequest } from '../dto/create-customer-profile-request.dto';
import { User } from 'src/decorator/user.decorator';
import { GenericUser } from 'src/type';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCustomerProfileRequest } from '../dto/update-customer-profile-request.dto';

@ApiTags('Web customer controller')
@Controller('web-customer')
@UseGuards(AccessTokenGuard, RolesGuard)
export class WebCustomerController {
  constructor(private readonly webCustomerService: WebCustomerService) {}

  @Roles(Role.Customer)
  @Post('create-customer-profile')
  @HttpCode(200)
  async createCustomerProfile(
    @Body() requestData: CreateCustomerProfileRequest,
    @User() user: GenericUser,
  ) {
    const res = await this.webCustomerService.createCustomerProfile(
      requestData,
      user,
    );
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
  @Roles(Role.Customer)
  @Get('customer-profile/:id')
  async getCustomerProfile(@Param('id') id: string, @User() user: GenericUser) {
    //Check if token data is mapping with requested data
    if (user.userId !== parseInt(id)) {
      throw new UnauthorizedException('Cannot access other user info');
    }
    const res = await this.webCustomerService.getCustomerProfile(parseInt(id));
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
  @Roles(Role.Customer)
  @Put('customer-profile/updateCustomer')
  async updateCustomer(
    @Body() requestData: UpdateCustomerProfileRequest,
    @User() user: GenericUser,
  ) {
    if (user.userId !== requestData.customer_id) {
      throw new UnauthorizedException('Cannot update other user info');
    }    
    const res = await this.webCustomerService.updateCustomerProfile(
      requestData, 
      user
    );
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
}
