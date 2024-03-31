import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FetchMode } from 'src/enum';

export class GetAvailableFoodByRestaurantRequest {
  @ApiProperty()
  menu_item_id: number;
  @ApiProperty()
  @IsEnum(FetchMode)
  @IsOptional()
  fetch_mode: FetchMode;
}
