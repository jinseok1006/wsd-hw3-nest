import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  LoggerService,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ErrorResponseDto } from "src/common/response.dto";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService
  ) {}

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // console.log(exception);

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse() as {
      error: string;
      message: string[] | string;
      statusCode: number;
    };

    // 로깅
    this.logger.warn({
      path: req.url,
      method: req.method,
      message: exception.message,
      stack: exception.stack,
    });
    // this.logger.warn({message: exception.message, stack: exception.stack});
    // console.log(exception.message);
    

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
