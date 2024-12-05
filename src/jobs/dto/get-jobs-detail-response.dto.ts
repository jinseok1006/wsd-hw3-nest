import { ApiProperty } from "@nestjs/swagger";
import { GetJobsResponseDto } from "./get-jobs-response.dto";
import { BookMarkSummary } from "./get-jobs-response.dto";

class TechStackDto {
  @ApiProperty({
    description: "기술 스택 ID",
    example: 101,
  })
  id: number;

  @ApiProperty({
    description: "기술 스택 이름",
    example: "React",
  })
  name: string;
}

class DeveloperPositionDto {
  @ApiProperty({
    description: "개발자 포지션",
    example: "Backend Developer",
  })
  name: string;
}

class CompanySummaryDto {
  @ApiProperty({
    description: "회사 ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "회사 이름",
    example: "ABC Corp",
  })
  name: string;
}

export class JobDetailDto {
  @ApiProperty({
    description: "공고 ID",
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: "공고 이미지 URL",
    example: "https://example.com/image.jpg",
  })
  image: string;

  @ApiProperty({
    description: "공고 제목",
    example: "Frontend Developer",
  })
  title: string;

  @ApiProperty({
    description: "급여",
    example: 60000000,
  })
  salary: number;

  @ApiProperty({
    description: "상세 위치 설명",
    example: "서울 강남구",
  })
  locationDescription: string;

  @ApiProperty({
    description: "연차 최소값",
    example: 3,
  })
  annualFrom: number;

  @ApiProperty({
    description: "연차 최대값",
    example: 5,
  })
  annualTo: number;

  @ApiProperty({
    description: "마감일",
    example: "2024-12-31T23:59:59.000Z",
  })
  closingDate: Date;

  @ApiProperty({
    description: "생성일",
    example: "2024-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "조회수",
    example: 1500,
  })
  views: number;

  @ApiProperty({ type: CompanySummaryDto })
  Company: CompanySummaryDto;

  @ApiProperty({ type: [TechStackDto] })
  TechStack: TechStackDto[];

  @ApiProperty({ type: [DeveloperPositionDto] })
  DeveloperPosition: DeveloperPositionDto[];

  @ApiProperty({ type: [BookMarkSummary] })
  Bookmark: BookMarkSummary[];
}

export class GetJobsDetailResponseDto {
  @ApiProperty({
    description: "공고 상세 정보",
    type: JobDetailDto,
  })
  jobs: JobDetailDto;

  @ApiProperty({
    description: "관련 공고 목록",
    type: [GetJobsResponseDto],
  })
  relatedJobs: GetJobsResponseDto[];

  constructor(jobs: JobDetailDto, relatedJobs: GetJobsResponseDto[]) {
    this.jobs = jobs;
    this.relatedJobs = relatedJobs;
  }
}
