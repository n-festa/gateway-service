import { Injectable, Logger, PipeTransform } from '@nestjs/common';

import { GateWayBadRequestException } from '../exceptions/gateway-bad-request.exception';

@Injectable()
export class ValidatePayloadExistsPipe implements PipeTransform {
  private logger = new Logger(ValidatePayloadExistsPipe.name);

  constructor(private ignoredKeys: string[] = ['order', 'offset']) {}

  transform(payload: any): any {
    this.logger.debug(
      'Validating payload with ignoredKeys: %j',
      payload,
      this.ignoredKeys,
    );
    if (
      payload !== null &&
      typeof payload === 'object' &&
      !Array.isArray(payload)
    ) {
      const properties = Object.keys(payload);

      if (!properties.length) {
        // throw new GateWayBadRequestException({
        //   details: [{ issue: 'Payload should not be empty' }],
        // });
        throw new GateWayBadRequestException({
          error_code: 1,
          detail: 'Payload should not be empty',
        });
      } else if (this.ignoredKeys?.length) {
        const effectiveProps = properties.filter(
          (key) => !this.ignoredKeys.includes(key),
        );

        if (!effectiveProps?.length) {
          // throw new GateWayBadRequestException({
          //   details: [
          //     {
          //       issue: `Payload must have properties other than ${this.ignoredKeys}`,
          //     },
          //   ],
          // });
          throw new GateWayBadRequestException({
            error_code: 1,
            detail: `Payload must have properties other than ${this.ignoredKeys}`,
          });
        }
      }
    }

    return payload;
  }
}
