import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarkListQueryDto } from "./dto/bookmark-list-query.dto";
import { BookmarkResponseDto } from "./dto/bookmark-response.dto";
import { BookmarkListDto } from "./dto/bookmark-list-response.dto";
import { PaginatedData, PaginationDto } from "src/common/response.dto";
import { CacheKeyHelper } from "src/common/cache/cache-key-helper";

import { CacheService } from "src/cache/cache.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class BookmarksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  /**
   * 북마크를 추가하거나 제거합니다 (토글 방식).
   * - 이미 북마크가 존재하면 삭제합니다.
   * - 북마크가 존재하지 않으면 새로 생성합니다.
   * @param userId 북마크 작업을 수행할 사용자의 ID
   * @param createBookmarkDto 북마크 추가를 위한 DTO (jobPostingId 포함)
   * @returns 북마크 상태 ("bookmarked" 또는 "unbookmarked")와 관련 데이터
   * @throws NotFoundException 제공된 jobPostingId가 존재하지 않을 경우
   */
  async toggleBookmark(
    userId: number,
    createBookmarkDto: CreateBookmarkDto
  ): Promise<BookmarkResponseDto> {
    const { jobPostingId } = createBookmarkDto;

    // 채용공고 존재 여부 확인
    const jobPostingExists = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPostingExists) {
      throw new NotFoundException(
        `${jobPostingId}번 채용공고가 존재하지 않습니다.`
      );
    }

    // 북마크가 이미 존재하는지 확인
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_jobPostingId: { userId, jobPostingId },
      },
    });

    let result: BookmarkResponseDto;

    if (existingBookmark) {
      // 북마크가 이미 존재하면 삭제 (unbookmark)
      await this.prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });

      result = {
        id: existingBookmark.id,
        status: "unbookmarked",
      };
    } else {
      // 북마크가 없으면 새로 생성
      const newBookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          jobPostingId,
        },
      });

      result = {
        id: newBookmark.id,
        status: "bookmarked",
      };
    }

    // 북마크 관련 캐시 삭제
    this.cacheService.invalidateBookmarksCache(userId);

    return result;
  }

  /**
   * 사용자가 등록한 북마크 목록을 조회합니다.
   * @param userId 북마크를 조회할 사용자의 ID
   * @param query 북마크 목록 필터링 및 정렬을 위한 Query DTO
   * @returns 페이지네이션 데이터와 함께 북마크 목록 반환
   */
  async getBookmarks(
    userId: number,
    query: BookmarkListQueryDto
  ): Promise<PaginatedData<BookmarkListDto>> {
    const { page = 1, limit = 20, sort = "latest" } = query;

    // 페이지네이션 오프셋 계산
    const offset = (page - 1) * limit;

    // 총 북마크 수와 북마크 데이터를 동시에 조회
    const [totalItems, bookmarks] = await Promise.all([
      this.prisma.bookmark.count({
        where: { userId },
      }),
      this.prisma.bookmark.findMany({
        where: { userId },
        // include: { JobPosting: true }, // 필요에 따라 포함된 데이터 선택
        skip: offset,
        take: limit,
        orderBy: { createdAt: sort === "latest" ? "desc" : "asc" },
        select: {
          id: true,
          JobPosting: {
            select: {
              id: true,
              title: true,
              locationDescription: true,
              annualFrom: true,
              annualTo: true,
              image: true,
              Company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // 페이지네이션 정보 생성
    const pagination = new PaginationDto(
      page,
      totalItems,
      Math.ceil(totalItems / limit)
    );

    return { data: bookmarks, pagination };
  }
}
