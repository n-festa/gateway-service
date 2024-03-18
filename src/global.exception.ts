import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GateWayBadRequestException } from './shared/exceptions/gateway-bad-request.exception';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof GateWayBadRequestException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      const status =
        exception instanceof HttpException ? exception.getStatus() : 500;
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message || 'Internal server error',
      });
    }
  }
}
