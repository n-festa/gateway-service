import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendContactFormRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recaptcha_token: string;
}
