import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyReCaptchaRequest {
  @IsNotEmpty()
  @IsString()
  verified_token: string;
}
