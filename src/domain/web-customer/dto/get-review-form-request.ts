import { ApiProperty } from '@nestjs/swagger';

export class GetReviewFormRequest {
  @ApiProperty()
  customer_id: number;
  @ApiProperty()
  order_id: number;
}
