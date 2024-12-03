import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiCommonResponses } from "src/common/api-response.decorator";
import { SuccessResponseDto } from "src/common/response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { UsersService } from "src/users/users.service";
import { LoginResponseDto } from "./dto/login-response.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { RefreshTokenResponseDto } from "./dto/refresh-token-response.dto";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post("register")
  @ApiCommonResponses()
  async create(
    @Body() body: RegisterDto
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    this.logger.debug({message:"회원가입 요청", body});
    const user = await this.usersService.createUser(body); // 사용자 생성
    return new SuccessResponseDto(user); // 생성된 사용자 반환
  }

  @Post("login")
  @ApiCommonResponses()
  async login(
    @Body() body: LoginDto
  ): Promise<SuccessResponseDto<LoginResponseDto>> {
    this.logger.debug({message:"로그인 요청", body});
    const loginResponse = await this.authService.login(body);
    return new SuccessResponseDto(loginResponse);
  }

  @UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증된 사용자만 접근 가능
  @Get('profile')
  @ApiCommonResponses()
  async getProfile(@Request() req): Promise<SuccessResponseDto<UserResponseDto>> {
    // 인증된 사용자의 ID를 가져오기
    const userId = req.user.sub;

    // 사용자 정보 조회
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 사용자 정보를 응답 DTO에 맞게 반환
    return new SuccessResponseDto(new UserResponseDto(user));
  }

  @Post('refresh')
  @ApiCommonResponses()
  async refreshToken(
    @Body() body: RefreshTokenRequestDto
  ): Promise<SuccessResponseDto<RefreshTokenResponseDto>> {
    this.logger.debug({ message: '리프레시 토큰 요청', body });
    const refreshTokenResponse = await this.authService.refreshToken(body);
    return new SuccessResponseDto(refreshTokenResponse);
  }
}
