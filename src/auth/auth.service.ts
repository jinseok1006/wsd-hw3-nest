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
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // 사용자 이메일로 찾기
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      this.logger.log("유저 없음");
      throw new UnauthorizedException("Invalid email or password");
    }

    // 비밀번호 확인 (실제 서비스에서는 해싱된 비밀번호 확인 필요)
    if (!Base64Encoder.compare(loginDto.password, user.hashedPassword)) {
      this.logger.log("비밀번호 틀림");
      throw new UnauthorizedException("Invalid email or password");
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

  async refreshToken(refreshTokenRequestDto: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const { refresh_token } = refreshTokenRequestDto;

    if (this.tokenService.isBlacklisted(refresh_token)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = this.tokenService.getRefreshToken(refresh_token);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      // 새로운 액세스 토큰 생성
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '1h' }
      );

      // 새로운 리프레시 토큰 생성
      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '7d' }
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
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(@Request() req): Promise<UserResponseDto> {
    const userId = req.user.sub;
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return new UserResponseDto(user);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
    const updateData: any = { ...updateProfileDto };

    if (updateProfileDto.password) {
      updateData.hashedPassword = Base64Encoder.encode(updateProfileDto.password);
      delete updateProfileDto.password;
    }

    const user = await this.usersService.updateUser(userId, updateData);

    return new UserResponseDto(user);
  }
}
