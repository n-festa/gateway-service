import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebCustomerCategoryService } from '../service/web.customer.category.service';
import { SearchByCategory } from '../dto/search-by-category-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Web customer category')
@Controller('web-customer/category')
export class WebCustomerCategoryController {
  constructor(private readonly categoryService: WebCustomerCategoryService) {}
  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Post('search')
  async searchFoodAndRestaurantByCategory(
    @Body() requestData: SearchByCategory,
  ) {
    return this.categoryService.searchFoodAndRestaurantByCategory(requestData);
  }
}
