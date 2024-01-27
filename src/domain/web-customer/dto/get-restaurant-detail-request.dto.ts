import { ApiProperty } from '@nestjs/swagger';

export class GetRestaurantDetailRequest {
  @ApiProperty()
  restaurant_id: number;
  @ApiProperty()
  lat: number;
  @ApiProperty()
  long: number;
}
