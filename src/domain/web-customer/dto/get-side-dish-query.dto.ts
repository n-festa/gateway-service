import { IsEnum } from 'class-validator';
import { FetchMode } from 'src/enum';

export class GetSideDishQuery {
  @IsEnum(FetchMode)
  fetch_mode: FetchMode;
}
