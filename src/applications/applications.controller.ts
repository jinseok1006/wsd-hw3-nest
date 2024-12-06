import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger";
import { GetApplicationsDto } from "./dto/get-applications.dto";
import { SuccessResponseDto } from "src/common/response.dto";
import { CreateApplicationResponseDto } from "./dto/create-application-response.dto";
import { GetApplicationsResponseDto } from "./dto/get-applications-response.dto";
import { CancelApplicationResponseDto } from "./dto/cancel-application-response.dto";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { ApiCommonErrorResponses } from "src/common/api-response.decorator";
import { SkipGlobalCache } from "src/common/cache/skip-global-cache.decorator";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: "지원서 작성" })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiSuccessResponse(
    CreateApplicationResponseDto,
    "지원서 작성 성공",
    HttpStatus.CREATED
  )
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  async createApplication(
    @Req() req,
    @Body() createApplicationDto: CreateApplicationDto
  ): Promise<SuccessResponseDto<CreateApplicationResponseDto>> {
    const userId = req.user.sub;
    const successResponse = await this.applicationsService.create(
      userId,
      createApplicationDto
    );
    return new SuccessResponseDto(successResponse);
  }

  @Get()
  @SkipGlobalCache()
  @UseInterceptors(UserCacheInterceptor)
  @ApiBearerAuth()
  @ApiSuccessResponse(GetApplicationsResponseDto, "지원서 목록 조회")
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiOperation({ summary: "지원서 목록 조회" })
  async getApplications(
    @Req() req,
    @Query() getApplicationsDto: GetApplicationsDto
  ): Promise<SuccessResponseDto<GetApplicationsResponseDto[]>> {
    const userId = req.user.sub;
    const applications = await this.applicationsService.getApplications(
      userId,
      getApplicationsDto
    );
    return new SuccessResponseDto(applications);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard) // 인증 미들웨어
  @ApiBearerAuth()
  @ApiParam({ name: "id", type: Number, description: "지원 취소할 지원서 ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSuccessResponse(
    CancelApplicationResponseDto,
    "지원서 취소 성공",
    HttpStatus.NO_CONTENT
  )
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiOperation({ summary: "지원서 취소" })
  async cancelApplication(
    @Req() req,
    @Param("id") applicationId: number
  ): Promise<SuccessResponseDto<CancelApplicationResponseDto>> {
    const userId = req.user.sub; // 인증된 사용자의 ID
    const canceledApplication =
      await this.applicationsService.cancelApplication(userId, +applicationId);
    return new SuccessResponseDto(canceledApplication);
  }
}
