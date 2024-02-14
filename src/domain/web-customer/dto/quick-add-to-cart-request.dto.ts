import { ApiProperty } from '@nestjs/swagger';

export class QuickAddToCartRequest {
  @ApiProperty()
  customer_id: number;
  @ApiProperty()
  menu_item_id: number;
}
