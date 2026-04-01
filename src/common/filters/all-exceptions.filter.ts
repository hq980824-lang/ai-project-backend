import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiResponse } from '../interfaces/api-response.interface';

function normalizeMessage(payload: string | object): string {
  if (typeof payload === 'string') {
    return payload;
  }
  const body = payload as Record<string, unknown>;
  const msg = body.message;
  if (Array.isArray(msg)) {
    return msg.map(String).join('; ');
  }
  if (typeof msg === 'string') {
    return msg;
  }
  if (typeof body.error === 'string') {
    return body.error;
  }
  return 'Request failed';
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = normalizeMessage(res);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const body: ApiResponse<null> = {
      code: status,
      message,
      data: null,
    };

    response.status(status).json(body);
  }
}
