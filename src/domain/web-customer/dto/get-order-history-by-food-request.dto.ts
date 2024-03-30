import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class TimeRange {
  @IsPositive()
  from: number; //timestamp
  @IsPositive()
  to: number; //timestamp
}
enum SortType {
  DATE_ASC = 'DATE_ASC',
  DATE_DESC = 'DATE_DESC',
  TOTAL_ASC = 'TOTAL_ASC',
  TOTAL_DESC = 'TOTAL_DESC',
}
enum HistoryOrderStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export class GetOrderHistoryByFoodRequest {
  @ApiProperty()
  @IsPositive()
  customer_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search_keyword: string;

  @ApiProperty()
  @IsEnum(SortType)
  sort_type: SortType;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsEnum(HistoryOrderStatus, { each: true })
  filtered_order_status: HistoryOrderStatus[]; // OPTIONAL - COMPLETED | FAILED | CANCELLED

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeRange)
  time_range: TimeRange; // OPTIONAL

  @ApiProperty()
  @Min(0)
  offset: number; //REQUIRED

  @ApiProperty()
  @Min(0)
  page_size: number; //REQUIRED
}
