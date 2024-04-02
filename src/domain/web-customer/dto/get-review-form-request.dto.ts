import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class GetReviewFormRequest {
  @ApiProperty()
  @IsPositive()
  customer_id: number;
  @ApiProperty()
  @IsPositive()
  order_id: number;
}
