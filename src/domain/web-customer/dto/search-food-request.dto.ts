import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum ResultType {
  FOOD = 'FOOD',
  RESTAURANT = 'RESTAURANT',
}
enum SortType {
  RELEVANCE = 'RELEVANCE',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
}
enum Filter {
  FROM_4STAR = 'FROM_4STAR',
  VEG = 'VEG',
  UPTO_500KCAL = 'UPTO_500KCAL',
}

enum IsoLangCode {
  VIE = 'vie',
  ENG = 'eng',
}

export class SearchFoodRequest {
  @ApiProperty()
  @IsString()
  keyword: string; //REQUIRED

  @ApiProperty()
  @IsEnum(IsoLangCode)
  ISO_language_code: IsoLangCode; //REQUIRED

  @ApiProperty()
  @IsDecimal()
  lat: string; //REQUIRED

  @ApiProperty()
  @IsDecimal()
  long: string; //REQUIRED

  @ApiProperty()
  @IsEnum(ResultType)
  result_type: ResultType; //REQUIRED - FOOD | RESTAURANT

  @ApiProperty()
  @IsEnum(SortType)
  sort_type: SortType; //REQUIRED - RELEVANCE | PRICE_ASC | PRICE_DESC

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsEnum(Filter, { each: true })
  filter: Filter[]; //OPTIONAL - FROM_4STAR | VEG | UPTO_500KCAL

  @ApiProperty()
  @IsNumber()
  offset: number; //REQUIRED

  @ApiProperty()
  @IsNumber()
  page_size: number; //REQUIRED

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  distance_limit_m: number; //OPTIONAL - DEFAULT: 10;000

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  base_distance_for_grouping_m: number; //OPTIONAL - DEFAUL: 200
}
