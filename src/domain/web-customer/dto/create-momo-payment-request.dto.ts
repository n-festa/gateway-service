import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateMomoPaymentRequest {
  @ApiProperty()
  @IsPositive()
  invoiceId: number;
}
