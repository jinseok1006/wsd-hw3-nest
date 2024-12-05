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

/**
 * Prisma 예외 필터: PrismaClientKnownRequestError를 처리하여 사용자에게 적절한 응답 반환.
 * - Prisma 예외 코드를 기반으로 사용자 친화적인 메시지로 변환
 * - 로깅 기능 포함
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService
  ) {}

  /**
   * PrismaClientKnownRequestError를 처리하여 HTTP 응답으로 변환.
   * @param exception PrismaClientKnownRequestError 객체
   * @param host ArgumentsHost (HTTP 요청/응답 객체에 접근)
   */
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // 기본 오류 메시지 및 상태 초기화
    let error = "Prisma 오류"; // 기본 에러 이름
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // 기본 상태 코드
    let message = "알려지지 않은 Prisma 오류"; // 기본 메시지

    // Prisma 오류 코드에 따른 처리
    switch (exception.code) {
      case "P2002": // Unique constraint 위반 (중복 오류)
        error = "중복 오류";
        status = HttpStatus.CONFLICT;
        message = `${exception.meta?.target} 필드 중복`;
        break;
      // 다른 Prisma 오류 코드에 대한 추가 처리 가능
      default:
        break;
    }

    // 예외 정보 로깅
    this.logger.warn({
      path: req.url, // 요청 URL
      method: req.method, // 요청 메서드
      message: exception.message, // 예외 메시지
      context: "PrismaExceptionFilter", // 로그의 컨텍스트
    });

    // 사용자 응답 데이터 생성
    const errorResponse = new ErrorResponseDto(error, [message], status);

    // JSON 형식으로 사용자 응답 반환
    res.status(status).json(errorResponse);
  }
}
