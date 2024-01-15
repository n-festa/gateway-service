import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartBasicRequest {
  @ApiProperty()
  customer_id: number;
  @ApiProperty()
  updated_items: QuantityUpdatedItem[];
}
interface QuantityUpdatedItem {
  item_id: number;
  qty_ordered: number;
}
