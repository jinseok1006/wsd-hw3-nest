import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "src/common/jwt-auth.guard";
import { CreateCompanyReviewDto } from "./dto/create-company-review.dto";
import { SuccessResponseDto } from "src/common/response.dto";
import { CreateCompanyReviewResponseDto } from "./dto/create-company-review-response.dto";
import { GetCompanyReviewsQueryDto } from "./dto/get-company-reviews-query.dto";
import { GetCompanyReviewsResponseDto } from "./dto/get-company-reviews-response.dto";
import { DeleteCompanyReviewResponseDto } from "./dto/delete-company-review-response.dto";

@Controller("reviews")
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Req() req,
    @Body() createReviewDto: CreateCompanyReviewDto
  ): Promise<SuccessResponseDto<CreateCompanyReviewResponseDto>> {
    const userId = req.user.sub; // 인증된 사용자 ID
    const newReview = await this.reviewsService.create(userId, createReviewDto);
    return new SuccessResponseDto(newReview);
  }

  @Get(":companyId")
  async getCompanyReviews(
    @Param("companyId") companyId: number,
    @Query() query: GetCompanyReviewsQueryDto
  ): Promise<SuccessResponseDto<GetCompanyReviewsResponseDto[]>> {
    const { data, pagination } = await this.reviewsService.findAll(
      companyId,
      query
    );
    return new SuccessResponseDto(data, pagination);
  }

  @Delete(":reviewId")
  async deleteReview(
    @Req() req,
    @Param("reviewId") reviewId: number
  ): Promise<SuccessResponseDto<DeleteCompanyReviewResponseDto>> {
    const userId = req.user.sub; // 인증된 사용자 ID
    const result = await this.reviewsService.remove(userId, +reviewId);
    return new SuccessResponseDto(result);
  }
}