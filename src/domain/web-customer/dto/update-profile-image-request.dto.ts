import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { FILE_TYPE } from 'src/enum';

export class UpdateProfileImageRequest {
  @IsNotEmpty()
  customer_id: number;
  @IsNotEmpty()
  @IsEnum(FILE_TYPE)
  type: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
