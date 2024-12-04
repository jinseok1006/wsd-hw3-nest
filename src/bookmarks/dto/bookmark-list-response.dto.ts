import { PaginationDto } from "src/common/response.dto";
import { JobSummaryDto } from "src/jobs/dto/get-jobs-response.dto";

// export class BookmarkListResponseDto {
//     jobId: number;
//     job: JobSummaryDto;
//     createdAt: string; // ISO format
//   }
class BookmarkListDto {
  id: number;
  JobPosting: JobSummaryDto;
}
export class BookmarkListResponseDto {
  bookmarks: BookmarkListDto[];
  pagination: PaginationDto;

  constructor(bookmarks: BookmarkListDto[], pagination: PaginationDto) {
    this.bookmarks = bookmarks;
    this.pagination = pagination;
  }
}
