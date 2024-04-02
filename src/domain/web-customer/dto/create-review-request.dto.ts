import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsPositive,
  IsString,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';

class DriverReview {
  @IsPositive()
  driver_id: number;
  @Min(1)
  @Max(5)
  score: string;
  @IsString()
  remarks: string;
  @IsArray()
  @IsUrl({ protocols: ['https', 'http'] }, { each: true })
  @IsOptional()
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
  @IsUrl({ protocols: ['https', 'http'] }, { each: true })
  @IsOptional()
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
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FoodReview)
  food_reviews: FoodReview[];
}
