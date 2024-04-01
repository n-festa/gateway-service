import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class DriverReview {
  @IsPositive()
  driver_id: number;
  @IsNumber()
  score: string;
  @IsString()
  remarks: string;
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  img_urls: string[];
}

class FoodReview {
  @IsPositive()
  order_sku_id: number;
  @IsPositive()
  score: number;
  @IsString()
  remarks: string;
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  img_urls: string[];
}

export class CreateOrderReviewRequestDto {
  @ApiProperty()
  @IsPositive()
  customer_id: number;

  @ApiProperty()
  @IsPositive()
  order_id: number;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => DriverReview)
  driver_review: DriverReview;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodReview)
  food_reviews: FoodReview[];
}
