import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { BookmarksService } from "./bookmarks.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarkListQueryDto } from "./dto/bookmark-list-query.dto";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("bookmarks")
@UseGuards(JwtAuthGuard) // Requires authentication
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  // 북마크 추가/제거
  @Post()
  @ApiBearerAuth()
  async toggleBookmark(
    @Request() req,
    @Body() createBookmarkDto: CreateBookmarkDto
  ) {
    const userId = req.user.sub; // Extracted from JWT
    return this.bookmarkService.toggleBookmark(userId, createBookmarkDto);
  }

  // 북마크 목록 조회
  @Get()
  @ApiBearerAuth()
  async getBookmarks(@Request() req, @Query() query: BookmarkListQueryDto) {
    const userId = req.user.sub; // Extracted from JWT
    return this.bookmarkService.getBookmarks(userId, query);
  }
}
