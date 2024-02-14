import { ApiProperty } from '@nestjs/swagger';

export class SendContactFormRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  message: string;
}
