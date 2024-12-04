import { PaginationDto } from "src/common/response.dto";

export class JobPostingSummaryDto {
  id: number; // 공고 ID
  image: string;
  title: string; // 공고 제목
  locationDescription: string; // 상세 위치 설명
  annualFrom: number; // 연차 최소값
  annualTo: number; // 연차 최대값
  Company: {
    id: number;
    name: string;
  };
}

class BookmarkListDto {
  id: number;
  JobPosting: JobPostingSummaryDto;
}

export class BookmarkListResponseDto {
  bookmarks: BookmarkListDto[];
  pagination: PaginationDto;

  constructor(bookmarks: BookmarkListDto[], pagination: PaginationDto) {
    this.bookmarks = bookmarks;
    this.pagination = pagination;
  }
}
