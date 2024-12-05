import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import { GetJobsQueryDto } from "./dto/get-jobs-query.dto";
import { GetJobsResponseDto } from "./dto/get-jobs-response.dto";
import { GetJobsDetailResponseDto } from "./dto/get-jobs-detail-response.dto";
import { SuccessResponseDto } from "src/common/response.dto";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";

@ApiTags("Jobs")
@UseGuards(JwtAuthGuard)
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiSuccessResponse(GetJobsResponseDto, "채용공고 전체 조회", HttpStatus.OK, true)
  async getJobs(
    @Req() req,
    @Query() query: GetJobsQueryDto
  ): Promise<SuccessResponseDto<GetJobsResponseDto[]>> {
    const userId = req.user.sub;
    const { data, pagination } = await this.jobsService.findAll(userId, query);
    return new SuccessResponseDto(data, pagination);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiParam({ name: "id", type: Number, description: "Job ID" })
  @ApiSuccessResponse(GetJobsDetailResponseDto, "채용공고 상세 조회")
  async getJobDetail(
    @Req() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<SuccessResponseDto<GetJobsDetailResponseDto>> {
    const userId = req.user.sub;
    const successResponse = await this.jobsService.findOne(userId, id);
    return new SuccessResponseDto(successResponse);
  }
}
