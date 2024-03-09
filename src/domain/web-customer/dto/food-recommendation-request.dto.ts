import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FetchMode } from 'src/enum';

export class FoodRecommendationRequest {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  long: number;
  @ApiProperty()
  @IsEnum(FetchMode)
  fetch_mode: FetchMode;
}
