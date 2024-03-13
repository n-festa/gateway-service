import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsPositive,
  IsString,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';

export class ApplyPromotionCodeRequest {
  @ApiProperty()
  @IsString()
  coupon_code: string;

  @ApiProperty()
  @IsPositive()
  restaurant_id: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CouponAppliedItem)
  @ArrayMinSize(1)
  items: CouponAppliedItem[];
}
class CouponAppliedItem {
  @IsPositive()
  sku_id: number;
  @IsPositive()
  qty_ordered: number;
  @Min(0)
  price_after_discount: number;
  @Min(0)
  packaging_price: number;
}
