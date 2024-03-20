import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class GetDeliveryFeeRequest {
  @ApiProperty()
  @IsPositive()
  restaurant_id: number; //REQUIRED

  @ApiProperty()
  @IsNumber()
  delivery_latitude: number; //REQUIRED

  @ApiProperty()
  @IsNumber()
  delivery_longitude: number; //REQUIRED
}
