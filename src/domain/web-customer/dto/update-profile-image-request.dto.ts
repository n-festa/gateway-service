import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateProfileImageRequest {
  @IsNotEmpty()
  customer_id: number;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
