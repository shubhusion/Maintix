import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@maintix/shared-types';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode,
      },
      statusCode,
    );
  }
}
