import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenService } from "src/token/token.service";
import {
  InvalidTokenException,
  TokenBlacklistedException,
  TokenNotFoundException,
} from "./custom-error";

/**
 * JWT 인증 가드: 요청에 포함된 JWT 토큰을 검증하고 사용자 정보를 인증합니다.
 * - 헤더에서 토큰을 추출하여 검증
 * - 블랙리스트 토큰 확인
 * - 검증된 사용자 정보를 요청 객체에 첨부
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * 인증 로직을 수행하여 요청의 유효성을 확인합니다.
   * @param context ExecutionContext (요청 컨텍스트)
   * @returns 인증 결과 (true: 인증 성공)
   * @throws TokenNotFoundException 토큰이 헤더에 없을 경우
   * @throws TokenBlacklistedException 블랙리스트에 등록된 토큰일 경우
   * @throws InvalidTokenException 토큰이 유효하지 않을 경우
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // request["user"] = { sub: 1 }; // 테스트용 사용자 데이터 (삭제 금지)

    // 헤더에서 토큰 추출
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new TokenNotFoundException(); // 토큰이 없을 경우 예외 처리
    }

    // 블랙리스트에 토큰이 포함되어 있는지 확인
    if (this.tokenService.isBlacklisted(token)) {
      throw new TokenBlacklistedException(); // 블랙리스트 토큰 예외 처리
    }

    try {
      // 토큰 검증 및 페이로드 추출
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // 비밀키를 사용하여 토큰 검증
      });
      // 사용자 정보를 요청 객체에 첨부
      request["user"] = payload;
    } catch {
      throw new InvalidTokenException(); // 유효하지 않은 토큰 예외 처리
    }

    return true;
  }

  /**
   * 요청 헤더에서 Bearer 토큰을 추출합니다.
   * @param request HTTP 요청 객체
   * @returns 추출된 토큰 (없을 경우 null 반환)
   */
  private extractTokenFromHeader(request: Request): string | null {
    const authorizationHeader = request.headers["authorization"];
    if (!authorizationHeader) {
      return null; // Authorization 헤더가 없을 경우
    }

    const [type, token] = authorizationHeader.split(" ");
    return type === "Bearer" ? token : null; // Bearer 토큰일 경우만 반환
  }
}
