import { ApiProperty } from '@nestjs/swagger';

export class GeneralServiceResponse {
  constructor() {
    this.statusCode = null;
    this.data = null;
  }

  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  data: any;
}
