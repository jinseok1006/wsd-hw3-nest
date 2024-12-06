import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiCommonErrorResponses } from "src/common/api-response.decorator";
import { PaginationDto, SuccessResponseDto } from "src/common/response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { UsersService } from "src/users/users.service";
import { LoginResponseDto } from "./dto/login-response.dto";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenRequestDto } from "./dto/refresh-token-request.dto";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "src/users/dto/update-user.dto"; // UpdateUserDto 임포트
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { SkipGlobalCache } from "src/common/cache/skip-global-cache.decorator";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";

@ApiExtraModels(PaginationDto)
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  @ApiCommonErrorResponses({ conflict: true, badRequest: true })
  @HttpCode(HttpStatus.CREATED)
  @ApiSuccessResponse(UserResponseDto, "회원가입 성공", HttpStatus.CREATED)
  @ApiOperation({ summary: "회원가입" })
  async create(
    @Body() body: RegisterDto
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    this.logger.debug({ message: "회원가입 요청", body });
    const user = await this.usersService.createUser(body); // 사용자 생성
    return new SuccessResponseDto(user); // 생성된 사용자 반환
  }

  @Post("login")
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiSuccessResponse(LoginResponseDto, "로그인 성공")
  @ApiOperation({ summary: "로그인" })
  async login(
    @Body() body: LoginDto
  ): Promise<SuccessResponseDto<LoginResponseDto>> {
    this.logger.debug({ message: "로그인 요청", body });
    const loginResponse = await this.authService.login(body);
    return new SuccessResponseDto(loginResponse);
  }

  // 프로필 확인
  @Get("profile")
  @UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증된 사용자만 접근 가능
  @SkipGlobalCache() // 전역 캐시 스킵
  @UseInterceptors(UserCacheInterceptor)
  @ApiBearerAuth()
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiSuccessResponse(UserResponseDto, "프로필 조회 성공")
  @ApiOperation({ summary: "프로필 조회" })
  async getProfile(
    @Request() req
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    // 인증된 사용자의 ID를 가져오기
    const userId = req.user.sub;

    // 사용자 정보 조회
    const user = await this.usersService.getUserById(userId);

    // 사용자 정보를 응답 DTO에 맞게 반환
    return new SuccessResponseDto(new UserResponseDto(user));
  }

  // 프로필 수정
  @Put("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCommonErrorResponses({badRequest: true, unauthorized: true})
  @ApiSuccessResponse(UserResponseDto, "프로필 업데이트 성공")
  @ApiOperation({ summary: "프로필 업데이트" })
  async updateProfile(
    @Request() req,
    @Body() body: UpdateUserDto // UpdateUserDto 사용
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    this.logger.debug({ message: "프로필 업데이트 요청", body });
    const userId = req.user.sub;
    const updatedUser = await this.usersService.updateUser(userId, body);
    return new SuccessResponseDto(new UserResponseDto(updatedUser));
  }

  @Post("refresh")
  @ApiCommonErrorResponses({ badRequest: true })
  @ApiSuccessResponse(LoginResponseDto, "리프레시 토큰 발급 성공")
  @ApiOperation({ summary: "리프레시 토큰 발급" })
  async refreshToken(
    @Body() body: RefreshTokenRequestDto
  ): Promise<SuccessResponseDto<LoginResponseDto>> {
    this.logger.debug({ message: "리프레시 토큰 요청", body });
    const refreshTokenResponse = await this.authService.refreshToken(body);
    return new SuccessResponseDto(refreshTokenResponse);
  }
}
