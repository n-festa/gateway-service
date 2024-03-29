import { ApiProperty } from '@nestjs/swagger';
import { GeneralResponse } from './general-response.dto';
import { TextByLang } from '../type';

export class GetCartDetailResponse extends GeneralResponse {
  @ApiProperty()
  data: CartDetail;
}

interface CartDetail {
  customer_id: number;
  restaurant_id: number;
  restaurant_name: TextByLang[];
  restaurant_logo_img: string;
  cart_info: FullCartItem[];
}

interface FullCartItem {
  item_id: number;
  item_name: TextByLang[];
  item_img: string;
  customer_id: number;
  sku_id: number;
  menu_item_id: number;
  quantity_available: number;
  price: number;
  price_after_discount: number;
  unit: string;
  qty_ordered: number;
  advanced_taste_customization: string;
  basic_taste_customization: string;
  portion_customization: string;
  advanced_taste_customization_obj: string;
  basic_taste_customization_obj: string;
  notes: string;
  packaging_info: CartPackagingInfo;
}

interface CartPackagingInfo {
  packaging_id: number;
  name: TextByLang[];
  price: number;
}
