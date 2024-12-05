import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from "class-validator";

export class GetJobsQueryDto {
  @ApiProperty({
    description: "페이지 번호 (기본값: 1)",
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: "page는 정수여야 합니다." })
  @Min(1, { message: "page는 1 이상이어야 합니다." })
  page?: number;

  @ApiProperty({
    description: "페이지 당 항목 수 (기본값: 20)",
    required: false,
    example: 20,
  })
  @IsOptional()
  @IsInt({ message: "size는 정수여야 합니다." })
  @Min(1, { message: "size는 1 이상이어야 합니다." })
  @Max(100, { message: "size는 100 이하이어야 합니다." })
  size?: number;

  @ApiProperty({
    description: "지역별 필터링(예: 서울, 경기, 대구 등)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "region은 문자열이어야 합니다." })
  region?: string;

  @ApiProperty({
    description: "최소 연차 필터링 (예: 1)",
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: "annualFrom은 정수여야 합니다." })
  @Min(0, { message: "annualFrom은 0 이상이어야 합니다." })
  annualFrom?: number;

  @ApiProperty({
    description: "최대 연차 필터링 (예: 10)",
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: "annualTo는 정수여야 합니다." })
  @Min(0, { message: "annualTo는 0 이상이어야 합니다." })
  annualTo?: number;

  @ApiProperty({
    description: "최소 연봉 필터링 (예: 2000)",
    required: false,
    example: 2000,
  })
  @IsOptional()
  @IsNumber({}, { message: "salaryFrom은 숫자여야 합니다." })
  @Min(0, { message: "salaryFrom은 0 이상이어야 합니다." })
  salaryFrom?: number;

  @ApiProperty({
    description: "최대 연봉 필터링 (예: 9000)",
    required: false,
    example: 9000,
  })
  @IsOptional()
  @IsNumber({}, { message: "salaryTo는 숫자여야 합니다." })
  @Min(0, { message: "salaryTo는 0 이상이어야 합니다." })
  salaryTo?: number;

  @ApiProperty({
    description: "기술 스택 필터링 (예: React, Node.js)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "tech는 문자열이어야 합니다." })
  tech?: string;

  @ApiProperty({
    description: "키워드 검색 (예: 개발자, 엔지니어)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "keyword는 문자열이어야 합니다." })
  keyword?: string;

  @ApiProperty({
    description: "회사 이름 검색 (예: 삼성전자)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "companyName은 문자열이어야 합니다." })
  companyName?: string;

  @ApiProperty({
    description: "포지션 검색 (예: 백엔드 개발자)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "position은 문자열이어야 합니다." })
  position?: string;

  @ApiProperty({
    description: "정렬 필드 및 순서 (예: createdAt:desc, salary:asc)",
    required: false,
    example: "createdAt:desc",
  })
  @IsOptional()
  @IsString({ message: "sort는 문자열이어야 합니다." })
  sort?: string;
}
