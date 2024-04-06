import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsPositive,
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsObject,
} from 'class-validator';

enum IsoLangCode {
  VIE = 'vie',
  ENG = 'eng',
}

class RecipeItem {
  @IsPositive()
  ingredient_id: number;

  @IsNumber()
  quantity: number;

  @IsPositive()
  unit_id: number;
}

class PortionCustomizationValue {
  @IsPositive()
  value: number;

  @IsPositive()
  unit_id: number;

  @IsNumber()
  price_variance: number; //Can be negative

  @IsBoolean()
  is_standard: boolean;
}

class PortionCustomizationItem {
  @IsString()
  name: string;

  @IsArray()
  @IsPositive({ each: true })
  corresponding_ingredients: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortionCustomizationValue)
  value: PortionCustomizationValue[];
}

class PriceSetting {
  standard: number;
  min: number;
  max: number;
}
class TasteCustomizationItem {
  @IsString()
  taste_id: string;

  @IsArray()
  @IsString({ each: true })
  taste_values: string[];
}

export class CreateMenuItemRequest {
  @IsPositive()
  restaurant_id: number; //REQUIRED

  @IsEnum(IsoLangCode)
  ISO_language_code: IsoLangCode; //REQUIRED

  @IsString()
  name: string; //REQUIRED

  @IsString()
  short_name: string; //REQUIRED

  @IsString()
  description: string; //REQUIRED

  @IsString()
  main_cooking_method: string; //REQUIRED

  @IsPositive()
  preparing_time_minutes: number; //REQUIRED

  @IsPositive()
  cooking_time_minutes: number; //REQUIRED

  @IsBoolean()
  is_vegetarian: boolean; //REQUIRED

  @IsPositive()
  res_category_id: number; //REQUIRED

  @IsUrl({ protocols: ['https', 'http'] })
  image_url: string; //REQUIRED

  @IsArray()
  @IsUrl({ protocols: ['https', 'http'] }, { each: true })
  @IsOptional()
  other_image_url: string[]; //OPTIONAL

  @IsArray()
  @IsString({ each: true })
  basic_customization: string[]; //REQUIRED

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeItem)
  recipe: RecipeItem[]; //REQUIRED

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortionCustomizationItem)
  portion_customization: PortionCustomizationItem[]; //REQUIRED

  @IsObject()
  @ValidateNested()
  @Type(() => PriceSetting)
  price: PriceSetting; //REQUIRED

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TasteCustomizationItem)
  taste_customization: TasteCustomizationItem[]; //REQUIRED

  @IsArray()
  @IsPositive({ each: true })
  packaging: number[]; //REQUIRED

  @IsOptional()
  secret_key: string; //OPTIONAL
}
