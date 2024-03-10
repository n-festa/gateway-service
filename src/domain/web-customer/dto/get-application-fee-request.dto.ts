import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsPositive } from 'class-validator';

export class GetApplicationFeeRequest {
  @ApiProperty()
  @IsDefined()
  @IsPositive()
  public items_total: number;
  @ApiProperty()
  @IsDefined()
  @IsPositive()
  public exchange_rate: number;
}
