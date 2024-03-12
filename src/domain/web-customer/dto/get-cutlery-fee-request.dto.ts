import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class GetCutleryFeeRequest {
  @ApiProperty()
  @IsPositive()
  restaurant_id: number;
  @ApiProperty()
  @IsPositive()
  item_quantity: number;
}
