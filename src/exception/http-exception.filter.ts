import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { LoggerService } from "@nestjs/common";

import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { ErrorResponseDto } from "src/common/response.dto";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // private readonly logger = winstonLogger;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // console.log(exception);

    // 로깅
    this.logger.error({
      path: req.url,
      method: req.method,
      message: exception.message,
      stack: exception.stack,
      context: "HttpExceptionFilter",
    });

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse() as {
      error: string;
      message: string[] | string;
      statusCode: number;
    };

    // 사용자 응답
    const errorResponse = new ErrorResponseDto(
      response.error,
      Array.isArray(response.message) ? response.message : [response.message],
      response.statusCode
    );

    // console.log(errorResponse);
    res.status(response.statusCode).json(errorResponse);
  }
}
