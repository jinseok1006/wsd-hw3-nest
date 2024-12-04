import { PaginationDto } from "src/common/response.dto";
import { JobSummaryDto } from "src/jobs/dto/get-jobs-response.dto";

// export class BookmarkListResponseDto {
//     jobId: number;
//     job: JobSummaryDto;
//     createdAt: string; // ISO format
//   }
  

export class  BookmarkListResponseDto {
  jobs: JobSummaryDto[];
  pagination: PaginationDto;

  constructor(jobs: JobSummaryDto[], pagination: PaginationDto) {
    this.jobs = jobs;
    this.pagination = pagination;
  }
}