import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { BookmarksService } from "./bookmarks.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarkListQueryDto } from "./dto/bookmark-list-query.dto";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApiSuccessResponse } from "src/utils/api-success-response.decorator";
import { SuccessResponseDto } from "src/common/response.dto";
import { BookmarkResponseDto } from "./dto/bookmark-response.dto";
import { BookmarkListDto } from "./dto/bookmark-list-response.dto";
import { ApiCommonErrorResponses } from "src/common/api-response.decorator";
import { SkipGlobalCache } from "src/common/cache/skip-global-cache.decorator";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";
// import { BookmarkListResponseDto } from "./dto/bookmark-list-response.dto";

@Controller("bookmarks")
@UseGuards(JwtAuthGuard) // Requires authentication
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  // 북마크 추가/제거
  // TODO: 응답 DTO 정의
  @Post()
  @ApiBearerAuth()
  @ApiSuccessResponse(BookmarkResponseDto, "채용공고 즐겨찾기 추가/제거 성공", HttpStatus.OK)
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiOperation({ summary: "채용공고 북마크 추가/제거" })
  async toggleBookmark(
    @Request() req,
    @Body() createBookmarkDto: CreateBookmarkDto
  ): Promise<SuccessResponseDto<BookmarkResponseDto>> {
    const userId = req.user.sub; // Extracted from JWT
    const successResponse = await this.bookmarkService.toggleBookmark(
      userId,
      createBookmarkDto
    );
    return new SuccessResponseDto(successResponse);
  }

  // 북마크 목록 조회
  @Get()
  @SkipGlobalCache() // Skip global cache
  @UseInterceptors(UserCacheInterceptor)
  @ApiBearerAuth()
  @ApiCommonErrorResponses({ badRequest: true, unauthorized: true })
  @ApiSuccessResponse(
    BookmarkListDto,
    "채용공고 즐겨찾기 목록 조회 성공",
    HttpStatus.OK,
    true
  )
  @ApiOperation({ summary: "채용공고 북마크 목록 조회" })
  async getBookmarks(
    @Request() req,
    @Query() query: BookmarkListQueryDto
  ): Promise<SuccessResponseDto<BookmarkListDto[]>> {
    const userId = req.user.sub; // Extracted from JWT
    const { data, pagination } = await this.bookmarkService.getBookmarks(
      userId,
      query
    );
    return new SuccessResponseDto(data, pagination);
  }
}
