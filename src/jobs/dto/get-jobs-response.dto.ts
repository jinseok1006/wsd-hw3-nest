import { PaginationDto } from "src/common/response.dto";

export class JobSummaryDto {
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
  Bookmark: {
    id: number;
    jobPostingId: number;
  }[];
  // 북마크 여부
}

export class GetJobsResponseDto {
  jobs: JobSummaryDto[]; // 공고 요약 리스트
  pagination: PaginationDto;

  constructor(jobs: JobSummaryDto[], pagination: PaginationDto) {
    this.jobs = jobs;
    this.pagination = pagination;
  }
}
