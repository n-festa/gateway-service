import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthenOtpRequest {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  inputOTP: string;
}
