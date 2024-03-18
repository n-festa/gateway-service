import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class Address {
  @IsString()
  address_line: string;
  @IsString()
  ward: string;
  @IsString()
  district: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}

class OrderItemRequest {
  @IsPositive()
  sku_id: number;
  @IsPositive()
  qty_ordered: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionSelection)
  advanced_taste_customization_obj: OptionSelection[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasicTasteSelection)
  basic_taste_customization_obj: BasicTasteSelection[];
  @IsString()
  notes: string;
  @IsPositive()
  packaging_id: number;
}
class OptionSelection {
  @IsString()
  option_id: string;
  @IsString()
  value_id: string;
}
class BasicTasteSelection {
  @IsString()
  no_adding_id: string;
}

export class CreateOrderRequest {
  @ApiProperty()
  @IsPositive()
  customer_id: number;

  @ApiProperty()
  @IsPositive()
  restaurant_id: number;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty()
  @Min(0)
  order_total: number;

  @ApiProperty()
  @Min(0)
  delivery_fee: number;

  @ApiProperty()
  @Min(0)
  packaging_fee: number;

  @ApiProperty()
  @Min(0)
  cutlery_fee: number;

  @ApiProperty()
  @Min(0)
  app_fee: number;

  @ApiProperty()
  @Min(0)
  coupon_value: number;

  @ApiProperty()
  @IsString()
  coupon_code: string;

  @ApiProperty()
  @IsPositive()
  payment_method_id: number;

  @ApiProperty()
  @IsPositive()
  expected_arrival_time: number;

  @ApiProperty()
  @IsString()
  driver_note: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequest)
  order_items: OrderItemRequest[];
}
