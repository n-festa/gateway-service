import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsPositive } from 'class-validator';

export class GetCouponInfoRequest {
  @ApiProperty()
  @IsPositive()
  restaurant_id: number; //Required
  @ApiProperty()
  @IsArray()
  @IsPositive({ each: true })
  sku_ids: number[]; //Required
}
