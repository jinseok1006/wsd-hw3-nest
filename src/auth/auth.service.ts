// src/auth/auth.service.ts
import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Base64Encoder } from "src/utils/base64Encoder";
import { TokenService } from "src/token/token.service";

// 커스텀 예외 클래스 임포트
import {
  InvalidCredentialsException,
  UserNotFoundException,
  InvalidTokenException,
  TokenExpiredException,
} from "src/common/custom-error";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CacheService } from "src/cache/cache.service";

/**
 * 인증 서비스: 사용자 로그인, 리프레시 토큰 갱신 등의 기능 제공
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
    // private readonly cacheService: CacheService
  ) {}

  /**
   * 사용자 로그인을 처리합니다.
   * - 이메일과 비밀번호를 확인하고 JWT 토큰을 발급합니다.
   * - 리프레시 토큰을 저장합니다.
   * @param loginDto 로그인 요청 데이터 (이메일, 비밀번호)
   * @returns 액세스 토큰과 리프레시 토큰
   * @throws UserNotFoundException 사용자가 존재하지 않을 경우
   * @throws InvalidCredentialsException 비밀번호가 일치하지 않을 경우
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // 사용자 이메일로 찾기
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UserNotFoundException(); // 사용자가 존재하지 않을 경우
    }

    // 비밀번호 확인
    if (!Base64Encoder.compare(loginDto.password, user.hashedPassword)) {
      throw new InvalidCredentialsException(); // 비밀번호 불일치
    }

    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: "7d" });

    // 리프레시 토큰 저장
    this.tokenService.addRefreshToken(refresh_token, user.id.toString());

    const data = {
      access_token,
      refresh_token,
    };

    return new LoginResponseDto(data);
  }

  /**
   * 리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급합니다.
   * - 기존 리프레시 토큰은 블랙리스트에 추가됩니다.
   * - 새로운 리프레시 토큰이 저장됩니다.
   * @param refreshTokenRequestDto 리프레시 토큰 요청 데이터
   * @returns 새로운 액세스 토큰과 리프레시 토큰
   * @throws InvalidTokenException 유효하지 않은 리프레시 토큰일 경우
   * @throws TokenExpiredException 리프레시 토큰이 만료된 경우
   */
  async refreshToken(
    refreshTokenRequestDto: RefreshTokenRequestDto
  ): Promise<LoginResponseDto> {
    const { refresh_token } = refreshTokenRequestDto;

    // 리프레시 토큰이 블랙리스트에 있는지 확인
    if (this.tokenService.isBlacklisted(refresh_token)) {
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }

    // 리프레시 토큰으로 사용자 ID 조회
    const userId = this.tokenService.getRefreshToken(refresh_token);
    if (!userId) {
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }

    try {
      // 리프레시 토큰 유효성 확인
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      // 새로운 액세스 토큰 생성
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: "1h" }
      );

      // 새로운 리프레시 토큰 생성
      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: "7d" }
      );

      // 기존 리프레시 토큰 블랙리스트 처리 및 삭제
      this.tokenService.addToBlacklist(refresh_token);
      this.tokenService.deleteRefreshToken(refresh_token);

      // 새로운 리프레시 토큰 저장
      this.tokenService.addRefreshToken(newRefreshToken, userId);

      return new LoginResponseDto({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    } catch (error) {
      // 토큰 만료 및 유효성 검사 예외 처리
      if (error.name === "TokenExpiredError") {
        throw new TokenExpiredException("리프레시 토큰이 만료되었습니다.");
      }
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }
  }
}
