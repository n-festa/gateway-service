import { Controller, Get } from '@nestjs/common';
import { WebCustomerCategoryService } from '../service/web.customer.category.service';

@Controller('web-customer/category')
export class WebCustomerCategoryController {
  constructor(private readonly categoryService: WebCustomerCategoryService) {}
  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }
}
