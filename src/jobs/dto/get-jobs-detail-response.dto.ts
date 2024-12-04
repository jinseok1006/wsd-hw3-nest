import { JobSummaryDto } from "./get-jobs-response.dto";

export class JobDetailDto {
  id: number; // 공고 ID
  image: string;
  title: string; // 공고 제목
  salary: number; // 급여
  locationDescription: string; // 상세 위치 설명
  annualFrom: number; // 연차 최소값
  annualTo: number; // 연차 최대값
  closingDate: Date; // 마감일
  createdAt: Date; // 생성일
  views: number; // 조회수
  Company: {
    id: number;
    name: string;
  };
  TechStack: {
    id: number;
    name: string;
  }[];
  DeveloperPosition: {
    name: string;
  }[];
  // 북마크 여부
}

export class GetJobsDetailResponseDto {
  jobs: JobDetailDto; // 공고 요약 리스트
  relatedJobs: JobSummaryDto[];

  constructor(jobs: JobDetailDto, relatedJobs: JobSummaryDto[]) {
    this.jobs = jobs;
    this.relatedJobs = relatedJobs;
  }
}
