import { ApiProperty } from '@nestjs/swagger';
import { GeneralResponse } from './general-response.dto';
import { TextByLang } from '../type';

export class QuickAddToCartResponse extends GeneralResponse {
  @ApiProperty()
  data: QuickAddToCartResponseData;
}

interface QuickAddToCartResponseData {
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
  restaurant_id: number;
}