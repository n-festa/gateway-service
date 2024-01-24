import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponse {
  constructor(statusCode: number, message: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
  }

  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: any;
  @ApiProperty()
  data: any;
}
