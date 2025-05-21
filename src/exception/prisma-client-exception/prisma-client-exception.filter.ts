import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    if (exception.code === 'P2002') {
      const status = HttpStatus.CONFLICT;
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    } else if (exception.code === 'P2003') {
      const status = HttpStatus.BAD_REQUEST;
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    } else if (exception.code === 'P2025') {
      const status = HttpStatus.NOT_FOUND;
      response.status(status).json({
        statusCode: status,
        message: `Resource not found: ${message}`,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
