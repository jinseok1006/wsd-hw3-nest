import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GetApplicationsDto } from "./dto/get-applications.dto";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiBearerAuth()
  async createApplication(
    @Req() req,
    @Body() createApplicationDto: CreateApplicationDto
  ) {
    const userId = req.user.sub;
    return this.applicationsService.create(userId, createApplicationDto);
  }

  @Get()
  @ApiBearerAuth()
  async getApplications(@Query() getApplicationsDto: GetApplicationsDto) {
    return this.applicationsService.getApplications(getApplicationsDto);
  }
}
