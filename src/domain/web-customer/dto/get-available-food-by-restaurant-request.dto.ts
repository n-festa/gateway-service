import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableFoodByRestaurantRequest {
  @ApiProperty()
  menu_item_id: number;
}
