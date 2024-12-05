import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCompanyReviewDto } from "./dto/create-company-review.dto";
import { CompanyReviewResponseDto } from "./dto/company-review-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetCompanyReviewsQueryDto } from "./dto/get-company-reviews-query.dto";
import { DeleteCompanyReviewResponseDto } from "./dto/delete-company-review-response.dto";
import { PaginatedData, PaginationDto } from "src/common/response.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: number,
    createReviewDto: CreateCompanyReviewDto
  ): Promise<CompanyReviewResponseDto> {
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
  ): Promise<PaginatedData<CompanyReviewResponseDto>> {
    const {
      page = 1,
      size = 10,
      sortByDate = "desc",
      minRating,
      maxRating,
    } = query;

    const take = +size; // 한 페이지에 표시할 리뷰 개수
    const skip = (page - 1) * take; // 건너뛸 리뷰 개수

    // 회사 존재 여부 확인
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException("존재하지 않는 회사입니다.");
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
      take,
      skip,
      select: {
        id: true,
        companyId: true,
        userId: true,
        rating: true,
        content: true,
      },
    });
    // 총 리뷰 개수 계산
    const total = await this.prisma.companyReview.count({
      where: {
        companyId,
        ...(minRating && { rating: { gte: minRating } }),
        ...(maxRating && { rating: { lte: maxRating } }),
      },
    });

    // 페이지네이션 정보 생성
    const pagination = new PaginationDto(page, total, Math.ceil(total / take));

    return { data: reviews, pagination };
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
    };
  }
}
