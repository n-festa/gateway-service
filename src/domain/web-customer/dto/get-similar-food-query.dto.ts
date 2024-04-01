import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';
import { FetchMode } from 'src/enum';

export class GetSimilarFoodQuery {
  @ApiProperty()
  // @IsPositive()
  @IsNumberString()
  menu_item_id: number;

  @ApiProperty()
  @IsEnum(FetchMode)
  fetch_mode: FetchMode;
}
