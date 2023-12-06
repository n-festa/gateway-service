import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WebCustomerCategoryService } from '../service/web.customer.category.service';
import { SearchByCategory } from '../dto/search-by-category-request.dto';

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
