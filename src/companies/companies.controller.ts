import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { CompanyDto } from "./dto/company-response.dto";
import { ApiCommonErrorResponses } from "src/common/api-response.decorator";
import { SuccessResponseDto } from "src/common/response.dto";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  /**
   * 회사 리스트를 반환합니다.
   * @returns 회사 리스트
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiSuccessResponse(CompanyDto, "회사 리스트 조회 성공", HttpStatus.OK, false, true)
  @ApiOperation({ summary: "회사 리스트 조회" })
  @ApiCommonErrorResponses({ unauthorized: true })
  async getCompanies(): Promise<SuccessResponseDto<CompanyDto[]>> {
    const companies = await this.companyService.getAllCompanies();
    return new SuccessResponseDto(companies);
  }
}
