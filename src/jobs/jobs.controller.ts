import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import { GetJobsQueryDto } from "./dto/get-jobs-query.dto";
import { GetJobsResponseDto } from "./dto/get-jobs-response.dto";
import { GetJobsDetailResponseDto } from "./dto/get-jobs-detail-response.dto";
import { JobsApiQuery } from "./jobs.api-query.decorator";
import { SuccessResponseDto } from "src/common/response.dto";

@ApiTags("Jobs")
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @JobsApiQuery()
  async getJobs(
    @Query() query: GetJobsQueryDto
  ): Promise<SuccessResponseDto<GetJobsResponseDto>> {
    const successResponse = await this.jobsService.findAll(query);
    return new SuccessResponseDto(successResponse);
  }

  @Get(":id")
  @ApiParam({ name: "id", type: Number, description: "Job ID" })
  async getJobDetail(
    @Param("id", ParseIntPipe) id: number
  ): Promise<SuccessResponseDto<GetJobsDetailResponseDto>> {
    const successResponse = await this.jobsService.findOne(id);
    return new SuccessResponseDto(successResponse);
  }
}
