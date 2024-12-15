import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { CreateCompanyReviewDto } from "./dto/create-company-review.dto";
import { SuccessResponseDto } from "src/common/response.dto";
import { CompanyReviewResponseDto } from "./dto/company-review-response.dto";
import { GetCompanyReviewsQueryDto } from "./dto/get-company-reviews-query.dto";
import { DeleteCompanyReviewResponseDto } from "./dto/delete-company-review-response.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { ApiCommonErrorResponses } from "src/common/api-response.decorator";

@ApiTags("Company Reviews")
@Controller("reviews")
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiSuccessResponse(
    CompanyReviewResponseDto,
    "리뷰 작성 성공",
    HttpStatus.CREATED
  )
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiOperation({ summary: "회사 리뷰 작성" })
  async createReview(
    @Req() req,
    @Body() createReviewDto: CreateCompanyReviewDto
  ): Promise<SuccessResponseDto<CompanyReviewResponseDto>> {
    const userId = req.user.sub; // 인증된 사용자 ID
    const newReview = await this.reviewsService.create(userId, createReviewDto);
    return new SuccessResponseDto(newReview);
  }

  @Get(":companyId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "companyId",
    type: Number,
    description: "리뷰 검색할 회사 ID",
  })
  @ApiSuccessResponse(
    CompanyReviewResponseDto,
    "회사 리뷰 조회 성공",
    HttpStatus.OK,
    true
  )
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiOperation({ summary: "회사 리뷰 조회" })
  async getCompanyReviews(
    @Param("companyId") companyId: number,
    @Query() query: GetCompanyReviewsQueryDto
  ): Promise<SuccessResponseDto<CompanyReviewResponseDto[]>> {
    const { data, pagination } = await this.reviewsService.findAll(
      companyId,
      query
    );
    return new SuccessResponseDto(data, pagination);
  }

  @Delete(":reviewId")
  @ApiParam({ name: "reviewId", type: Number, description: "삭제할 게시글 ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiSuccessResponse(
    DeleteCompanyReviewResponseDto,
    "리뷰 삭제 성공",
    HttpStatus.NO_CONTENT
  )
  @ApiCommonErrorResponses({
    badRequest: true,
    unauthorized: true,
    forbidden: true,
  })
  @ApiOperation({ summary: "회사 리뷰 삭제" })
  async deleteReview(
    @Req() req,
    @Param("reviewId") reviewId: number
  ): Promise<SuccessResponseDto<DeleteCompanyReviewResponseDto>> {
    const userId = req.user.sub; // 인증된 사용자 ID
    const result = await this.reviewsService.remove(userId, +reviewId);
    return new SuccessResponseDto(result);
  }
}
