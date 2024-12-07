import { Controller, Get, HttpStatus } from "@nestjs/common";
import { MetadataService } from "./metadata.service";
import { DeveloperPositionDto } from "./dto/developer-position.dto";
import { TechStackDto } from "./dto/tech-stack.dto";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { ApiOperation } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/common/response.dto";

@Controller("metadata")
export class MetadataController {
  constructor(private readonly filtersService: MetadataService) {}

  // 개발자 직무 리스트
  @Get("developer-positions")
  @ApiSuccessResponse(DeveloperPositionDto, "조회 성공", HttpStatus.OK, false, true)
  @ApiOperation({ summary: "개발자 직무 리스트" })
  async getDeveloperPositions(): Promise<
    SuccessResponseDto<DeveloperPositionDto[]>
  > {
    const successResponse = await this.filtersService.getDeveloperPositions();
    return new SuccessResponseDto(successResponse);
  }

  // 기술 스택 리스트
  @Get("tech-stacks")
  @ApiSuccessResponse(TechStackDto, "조회 성공", HttpStatus.OK, false, true)
  @ApiOperation({ summary: "기술 스택 리스트" })
  async getTechStacks(): Promise<SuccessResponseDto<TechStackDto[]>> {
    const successResponse = await this.filtersService.getTechStacks();
    return new SuccessResponseDto(successResponse);
  }
}
