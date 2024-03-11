import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GetAvailableDeliveryTimeRequest {
  @ApiProperty()
  menu_item_ids: number[];
  @ApiProperty()
  now: number;
  @ApiProperty()
  long: number;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  utc_offset: number;
  @ApiProperty()
  @IsBoolean()
  having_advanced_customization: boolean;
}
