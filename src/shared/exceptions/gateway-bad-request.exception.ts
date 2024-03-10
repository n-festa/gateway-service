import { BadRequestException } from '@nestjs/common';
import { GeneralErrorResponse } from '../dtos/general-error-response.dto';

// see https://www.codetinkerer.com/2015/12/04/choosing-an-http-status-code.html
// see https://www.webfx.com/web-development/glossary/http-status-codes/
export class GateWayBadRequestException extends BadRequestException {
  // constructor(public readonly body: { details: ClientErrorDetails[] }) {
  constructor(public readonly body: GeneralErrorResponse) {
    super(body);
  }
}
