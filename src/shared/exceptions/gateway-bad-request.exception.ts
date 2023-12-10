import { BadRequestException } from '@nestjs/common';

import { ClientErrorDetails } from '../dtos/common.dtos';

// see https://www.codetinkerer.com/2015/12/04/choosing-an-http-status-code.html
// see https://www.webfx.com/web-development/glossary/http-status-codes/
export class GateWayBadRequestException extends BadRequestException {
  constructor(public readonly body: { details: ClientErrorDetails[] }) {
    super(body);
  }
}
