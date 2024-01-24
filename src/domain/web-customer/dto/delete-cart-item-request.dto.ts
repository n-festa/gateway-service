import { ApiProperty } from '@nestjs/swagger';

export class DeleteCartItemRequest {
  @ApiProperty()
  customer_id: number;
  @ApiProperty()
  cart_items: number[];
}
