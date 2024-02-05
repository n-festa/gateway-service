import { ApiProperty } from '@nestjs/swagger';

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
}
