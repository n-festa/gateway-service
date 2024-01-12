import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartAdvancedRequest {
  @ApiProperty()
  customer_id: number;
  @ApiProperty()
  item_id: number;
  @ApiProperty()
  sku_id: number;
  @ApiProperty()
  qty_ordered: number;
  @ApiProperty()
  advanced_taste_customization_obj: OptionSelection[];
  @ApiProperty()
  basic_taste_customization_obj: BasicTasteSelection[];
  @ApiProperty()
  notes: string;
  @ApiProperty()
  lang?: string;
}

interface OptionSelection {
  option_id: string;
  value_id: string;
}

interface BasicTasteSelection {
  no_adding_id: string;
}
