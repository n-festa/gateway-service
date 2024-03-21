import { IsEnum, IsPositive } from 'class-validator';
import { OrderStatus } from 'src/enum';

export class ChangeOrderStatusForTestingRequest {
  @IsPositive()
  public order_id: number;
  @IsEnum(OrderStatus)
  public new_order_status: string;
}
