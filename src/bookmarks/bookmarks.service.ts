import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarkListQueryDto } from "./dto/bookmark-list-query.dto";
import { BookmarkResponseDto } from "./dto/bookmark-response.dto";
import { BookmarkListDto } from "./dto/bookmark-list-response.dto";
import { PaginatedData, PaginationDto } from "src/common/response.dto";

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleBookmark(
    userId: number,
    createBookmarkDto: CreateBookmarkDto
  ): Promise<BookmarkResponseDto> {
    const { jobPostingId } = createBookmarkDto;

    // Check if the job posting exists
    const jobPostingExists = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPostingExists) {
      throw new NotFoundException(
        `${jobPostingId}번 채용공고가 존재하지 않습니다.`
      );
    }

    // Check if the bookmark already exists
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_jobPostingId: { userId, jobPostingId },
      },
    });

    if (existingBookmark) {
      // If it exists, remove it (unbookmark)
      await this.prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });

      return {
        id: existingBookmark.id,
        status: "unbookmarked",
      };
    } else {
      // Otherwise, create a new bookmark
      const newBookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          jobPostingId,
        },
      });

      return {
        id: newBookmark.id,
        status: "bookmarked",
      };
    }
  }
  // 북마크 목록 조회
  async getBookmarks(
    userId: number,
    query: BookmarkListQueryDto
  ): Promise<PaginatedData<BookmarkListDto>> {
    const { page = 1, limit = 20, sort = "latest" } = query;

    // Calculate pagination offset
    const offset = (page - 1) * limit;

    // Fetch bookmarks with pagination and sorting
    const [totalItems, bookmarks] = await Promise.all([
      this.prisma.bookmark.count({
        where: { userId },
      }),
      this.prisma.bookmark.findMany({
        where: { userId },
        // include: { JobPosting: true },
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
    const pagination = new PaginationDto(
      page,
      totalItems,
      Math.ceil(totalItems / limit)
    );
    return { data: bookmarks, pagination };
  }
}
