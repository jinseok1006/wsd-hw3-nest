import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarkListQueryDto } from "./dto/bookmark-list-query.dto";
import { BookmarkResponseDto } from "./dto/bookmark-response.dto";
import { JobSummaryDto } from "src/jobs/dto/get-jobs-response.dto";
import { BookmarkListResponseDto } from "./dto/bookmark-list-response.dto";
import { PaginationDto } from "src/common/response.dto";

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  // 북마크 추가/제거 (Toggle)
  async toggleBookmark(
    userId: number,
    createBookmarkDto: CreateBookmarkDto
  ): Promise<BookmarkResponseDto> {
    const { jobPostingId } = createBookmarkDto;

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
        status: "success",
        message: "Bookmark removed successfully",
        bookmarked: false,
      };
    } else {
      // Otherwise, create a new bookmark
      await this.prisma.bookmark.create({
        data: {
          userId,
          jobPostingId,
        },
      });

      return {
        status: "success",
        message: "Bookmark added successfully",
        bookmarked: true,
      };
    }
  }

  // 북마크 목록 조회
  async getBookmarks(userId: number, query: BookmarkListQueryDto) {
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

    // Map the results to the response DTO
    // const data = bookmarks.map((bookmark) => ({
    //   jobId: bookmark.jobPostingId,
    //   title: bookmark.JobPosting.title,
    //   createdAt: bookmark.createdAt.toISOString(),
    // }));
    return bookmarks;
    // return new BookmarkListResponseDto(
    //   bookmarks,
    //   new PaginationDto(page, totalItems, Math.ceil(totalItems / limit))
    // );
    // return {
    //   bookmarks,
    //   pagination: {
    //     currentPage: page,
    //     totalPages: Math.ceil(totalItems / limit),
    //     totalItems,
    //   },
    // };
  }
}
