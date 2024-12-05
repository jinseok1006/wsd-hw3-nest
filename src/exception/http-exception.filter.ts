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

/**
 * 전역 예외 필터: 모든 예외를 처리하며, HTTP 응답으로 변환합니다.
 * - 로깅 기능 포함
 * - HttpException이 아닌 예외는 InternalServerErrorException으로 처리
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  /**
   * 예외를 처리하여 사용자에게 적절한 응답을 반환합니다.
   * @param exception 발생한 예외 객체
   * @param host ArgumentsHost (HTTP 요청/응답 객체에 접근)
   */
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // 예외 정보 로깅
    this.logger.error({
      path: req.url, // 요청 URL
      method: req.method, // 요청 메서드 (GET, POST 등)
      message: exception.message, // 예외 메시지
      stack: exception.stack, // 스택 추적
      context: "HttpExceptionFilter", // 로그의 컨텍스트
    });

    // HttpException이 아닌 예외는 InternalServerErrorException으로 변환
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    // 예외 응답 데이터 추출
    const response = (exception as HttpException).getResponse() as {
      error: string;
      message: string[] | string;
      statusCode: number;
    };

    // 사용자 응답 데이터 생성
    const errorResponse = new ErrorResponseDto(
      response.error, // 에러 이름
      Array.isArray(response.message) ? response.message : [response.message], // 에러 메시지 배열
      response.statusCode // HTTP 상태 코드
    );

    // 사용자에게 JSON 형식으로 응답 반환
    res.status(response.statusCode).json(errorResponse);
  }
}
