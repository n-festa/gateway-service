import { ValidationError } from '@nestjs/common';

import { ClientErrorDetails } from '../dtos/common.dtos';
import { GateWayBadRequestException } from './gateway-bad-request.exception';

export const validationErrorParser = (errors: ValidationError[]) => {
  const details: ClientErrorDetails[] = [];
  for (const error of errors) {
    const violatedContraints: string[] = [];
    for (const constraint in error.constraints) {
      const message = error.constraints[constraint];
      violatedContraints.push(message);
    }

    const clientErrorDetails: ClientErrorDetails = {
      field: error.property,
      issue: violatedContraints.join(','),
    };
    details.push(clientErrorDetails);

    if (error.children && error.children.length > 0) {
      const childrenBadRequestException = validationErrorParser(error.children);
      clientErrorDetails.childrenDetails =
        childrenBadRequestException.body.details;
    }
  }
  return new GateWayBadRequestException({
    details,
  });
};
