// src/auth/auth.service.ts
import {
  Inject,
  Injectable,
  LoggerService,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UsersService } from "src/users/users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Base64Encoder } from "src/utils/base64Encorder";
import { TokenService } from "src/token/token.service";

// 커스텀 예외 클래스 임포트
import {
  InvalidCredentialsException,
  UserNotFoundException,
  InvalidTokenException,
  TokenExpiredException,
} from "src/common/custom-error";

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // 사용자 이메일로 찾기
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    // 비밀번호 확인 (실제 서비스에서는 해싱된 비밀번호 확인 필요)
    if (!Base64Encoder.compare(loginDto.password, user.hashedPassword)) {
      throw new InvalidCredentialsException();
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

  async refreshToken(
    refreshTokenRequestDto: RefreshTokenRequestDto
  ): Promise<LoginResponseDto> {
    const { refresh_token } = refreshTokenRequestDto;

    if (this.tokenService.isBlacklisted(refresh_token)) {
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }

    const userId = this.tokenService.getRefreshToken(refresh_token);
    if (!userId) {
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }

    try {
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

      // 기존 리프레시 토큰 블랙리스트에 추가 및 삭제
      this.tokenService.addToBlacklist(refresh_token);
      this.tokenService.deleteRefreshToken(refresh_token);

      // 새로운 리프레시 토큰 저장
      this.tokenService.addRefreshToken(newRefreshToken, userId);

      return new LoginResponseDto({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new TokenExpiredException("리프레시 토큰이 만료되었습니다.");
      }
      throw new InvalidTokenException("유효하지 않은 리프레시 토큰입니다.");
    }
  }

  async getProfile(@Request() req): Promise<UserResponseDto> {
    const userId = req.user.sub;
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    return new UserResponseDto(user);
  }

}
