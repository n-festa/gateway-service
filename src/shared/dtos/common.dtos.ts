import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
} from 'class-validator';
import { MAXIMUM_LIMIT_ON_PAGING } from '../constants/service.constant';
import { HEADER } from '../constants/config.constant';

export class PaginationArgs {
  @ApiProperty({
    required: false,
    description: 'If consumer need the total number, set this prop to true',
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  needTotal? = false;

  @ApiProperty({
    required: false,
    default: 0,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  offset = 0;

  @ApiProperty({
    required: false,
    default: 100,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(MAXIMUM_LIMIT_ON_PAGING)
  limit = 100;
}

/**
 * Common Find Arguments/Parameter to API `list` an entity
 */
export class FindArgs extends PaginationArgs {
  @ApiProperty({
    type: [Number],
    required: false,
    description: 'Search/filter data by ids',
  })
  @Transform((params) => transformToArrayNumber(params.value))
  ids?: number[];

  @ApiProperty({
    required: false,
    description: 'Search data by query name like',
  })
  q?: string;

  @ApiProperty({
    required: false,
    description: 'Valid pattern is ^(name|id):(DESC|ASC)',
    pattern: '^(name|id):(DESC|ASC)',
  })
  @IsOptional()
  @Matches(`^(name|id):(DESC|ASC)`)
  order?: string;
}

/**
 * Pagination Result
 */
export class PaginationResult<T> {
  /**
   * offset
   */
  @ApiProperty()
  offset: number;

  /**
   * limit
   */
  @ApiProperty()
  limit: number;

  /**
   * Total items
   */
  @ApiProperty({
    required: false,
  })
  total?: number;

  /**
   * Has next page?!
   */
  @ApiProperty({
    type: Boolean,
  })
  hasNext = false;

  items: T[];
}

/**
 * Generate pagination result
 */
export function genPaginationResult<T>(
  items: T[],
  total: number | undefined,
  offset: number,
  limit: number,
): PaginationResult<T> {
  const result = new PaginationResult<T>();

  result.offset = offset;
  result.limit = limit;
  result.total = total;

  if (total !== undefined) {
    result.hasNext = result.offset + result.limit < result.total;
  } else {
    result.hasNext = items.length > limit;
    if (result.hasNext) {
      items.pop();
    }
  }

  result.items = items;

  return result;
}

export class CreatedObj {
  @ApiProperty({
    name: 'id',
    type: 'string',
    required: true,
  })
  id: number;
}

export enum ClientErrorIssueId {
  ENTITY_IN_UNAPPROPRIATE_STATUS = 'ENTITY_IN_UNAPPROPRIATE_STATUS',
  ENTITY_CONSTRAINT_UNSATISFIED = 'ENTITY_CONSTRAINT_UNSATISFIED',
  ONE_OF_OPTIONAL_PROPERTY_MUST_BE_PROVIDED = `ONE_OPTIONAL_PROPERTY_MUST_BE_PROVIDED`,
  ENTITY_UNIQUE_UNSATISFIED = 'ENTITY_UNIQUE_UNSATISFIED',
  ENTITY_ALREADY_EXIST = 'ENTITY_ALREADY_EXIST',
}

export class ClientErrorDetails {
  @ApiProperty({ required: false })
  field?: string;

  @ApiProperty()
  issue: string;

  @ApiProperty({ type: ClientErrorIssueId, enum: ClientErrorIssueId })
  issue_id?: ClientErrorIssueId;

  @ApiProperty({ required: false })
  childrenDetails?: ClientErrorDetails[];
}

export class ErrorResponseBody {
  @ApiProperty({
    name: 'request_id',
    type: 'string',
    required: true,
  })
  request_id: string;
  @ApiProperty({
    name: 'message',
    type: 'string',
    required: true,
  })
  message: string;
  @ApiProperty({
    type: ClientErrorDetails,
    required: false,
  })
  details: ClientErrorDetails[];
}

export class IdNameRequiredBaseResponse {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  name: string;
}

export function transformToArrayNumber(value: string | string[]): number[] {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const ints = value.map((item) => parseInt(item, 10));
    return ints;
  } else {
    return [parseInt(value, 10)];
  }
}

export class MergePatchContentTypeHeaderDTO {
  @IsString()
  @IsDefined()
  @Equals(HEADER.MERGE_PATCH) // must equal
  @Expose({ name: HEADER.CONTENT_TYPE.toLowerCase() }) // required as headers are case insensitive
  contentType: string;
}

/**
 * @param timeFrom HH:MM:SS
 * @param timeTo HH:MM:SS
 */
export function isValidTimeInDay(timeFrom: string, timeTo: string): boolean {
  const strArray1 = timeFrom.split(':');
  const fromHour = parseInt(strArray1[0], 10);
  const fromMinute = parseInt(strArray1[1], 10);
  const fromSecond = strArray1[2] ? parseInt(strArray1[2], 10) : 0;

  const strArray2 = timeTo.split(':');
  const toHour = parseInt(strArray2[0], 10);
  const toMinute = parseInt(strArray2[1], 10);
  const toSecond = strArray2[2] ? parseInt(strArray2[2], 10) : 0;

  const fromSecondInDay = fromHour * 3600 + fromMinute * 60 + fromSecond;
  const toSecondInDay = toHour * 3600 + toMinute * 60 + toSecond;

  return toSecondInDay > fromSecondInDay;
}
