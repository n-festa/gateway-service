import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import { WebCustomerCategoryService } from '../service/web.customer.category.service';
import { SearchByCategory } from '../dto/search-by-category-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { FlagsmitService } from 'src/dependency/flagsmith/flagsmith.service';

@ApiTags('Web customer category')
@Controller('web-customer/category')
export class WebCustomerCategoryController {
  constructor(
    private readonly categoryService: WebCustomerCategoryService,
    @Inject('FLAGSMITH_SERVICE') private readonly flagService: FlagsmitService,
  ) {}
  @Get()
  async getCategories() {
    const res = await this.categoryService.getCategories();
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }

  @Post('search')
  @HttpCode(200)
  async searchFoodAndRestaurantByCategory(
    @Body() requestData: SearchByCategory,
  ) {
    const res =
      await this.categoryService.searchFoodAndRestaurantByCategory(requestData);
    if (res.statusCode >= 400) {
      throw new HttpException(res, res.statusCode);
    }
    return res;
  }
}
