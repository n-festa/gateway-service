import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsUrl } from 'class-validator';

export class UpdateProfileImageRequest {
  @ApiProperty()
  @IsPositive()
  customer_id: number;
  // @IsNotEmpty()
  // @IsEnum(FILE_TYPE)
  // type: string;
  // @IsNotEmpty()
  // name: string;
  // @IsNotEmpty()
  // description: string;
  @ApiProperty()
  // @IsNotEmpty()
  @IsUrl()
  url: string;
}
