import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { GetApplicationsDto } from "./dto/get-applications.dto";
import { SuccessResponseDto } from "src/common/response.dto";
import { CreateApplicationResponseDto } from "./dto/create-application-response.dto";
import { GetApplicationsResponseDto } from "./dto/get-applications-response.dto";
import { CancelApplicationResponseDto } from "./dto/cancel-application-response.dto";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiParam({ name: "id", type: Number, description: "지원 취소할 지원서 ID" })
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
