import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCompanyReviewDto } from "./dto/create-company-review.dto";
import { CreateCompanyReviewResponseDto } from "./dto/create-company-review-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCompanyReviewsQueryDto } from "./dto/get-company-reviews-query.dto";
import { GetCompanyReviewsResponseDto } from "./dto/get-company-reviews-response.dto";
import { DeleteCompanyReviewResponseDto } from "./dto/delete-company-review-response.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: number,
    createReviewDto: CreateCompanyReviewDto
  ): Promise<CreateCompanyReviewResponseDto> {
    const { companyId, rating, content } = createReviewDto;

    // 회사 존재 여부 확인
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error("존재하지 않는 회사입니다.");
    }

    // 리뷰 생성
    const newReview = await this.prisma.companyReview.create({
      data: {
        userId,
        companyId,
        rating,
        content,
      },
      select: {
        id: true,
        userId: true,
        companyId: true,
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newReview;
  }

  async findAll(
    companyId: number,
    query: GetCompanyReviewsQueryDto
  ): Promise<GetCompanyReviewsResponseDto[]> {
    const { sortByDate = "desc", minRating, maxRating } = query;

    // 회사 존재 여부 확인
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error("존재하지 않는 회사입니다.");
    }

    // 특정 회사에 대한 리뷰 조회
    const reviews = await this.prisma.companyReview.findMany({
      where: {
        companyId,
        ...(minRating && { rating: { gte: minRating } }),
        ...(maxRating && { rating: { lte: maxRating } }),
      },
      orderBy: {
        createdAt: sortByDate,
      },
      select: {
        id: true,
        userId: true,
        rating: true,
        content: true,
        createdAt: true,
      },
    });

    return reviews;
  }

  async remove(
    userId: number,
    reviewId: number
  ): Promise<DeleteCompanyReviewResponseDto> {
    // 리뷰 존재 여부 확인
    const review = await this.prisma.companyReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException("해당 리뷰를 찾을 수 없습니다.");
    }

    // 사용자 권한 확인
    if (review.userId !== userId) {
      throw new ForbiddenException("이 리뷰를 삭제할 권한이 없습니다.");
    }

    // 리뷰 삭제
    await this.prisma.companyReview.delete({
      where: { id: reviewId },
    });

    return {
      id: review.id,
      message: "리뷰가 성공적으로 삭제되었습니다.",
    };
  }
}
