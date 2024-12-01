import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  LoggerService,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ErrorResponseDto } from "src/common/response.dto";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService
  ) {}

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let error = "Prisma 오류";
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "알려지지 않은 Prisma 오류";

    switch (exception.code) {
      case "P2002":
        error = "중복 오류";
        status = HttpStatus.CONFLICT;
        message = `${exception.meta?.target} 필드 중복`;
        break;
      // 다른 Prisma 오류 코드에 대한 추가 처리
      default:
        break;
    }

    // 로깅
    this.logger.warn({
      path: req.url,
      method: req.method,
      message: exception.message,
      context: "PrismaExceptionFilter",
    });
    // console.log(exception);

    // 사용자 응답
    const errorResponse = new ErrorResponseDto(error, [message], status);

    res.status(status).json(errorResponse);
  }
}
