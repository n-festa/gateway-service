import { ValidationError } from '@nestjs/common';

import { ClientErrorDetails } from '../dtos/common.dtos';
import { GateWayBadRequestException } from './gateway-bad-request.exception';
import { GeneralErrorResponse } from '../dtos/general-error-response.dto';

export const validationErrorParser = (errors: ValidationError[]) => {
  const bodyData = new GeneralErrorResponse();
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
      clientErrorDetails.childrenDetails = validationChildrenErrorParser(
        error.children,
      );
    }
  }
  bodyData.error_code = 1;
  bodyData.detail = details;
  return new GateWayBadRequestException(bodyData);
};

const validationChildrenErrorParser = (errors: ValidationError[]) => {
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
      clientErrorDetails.childrenDetails = validationChildrenErrorParser(
        error.children,
      );
    }
  }
  return details;
};
