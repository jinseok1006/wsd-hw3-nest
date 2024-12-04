export class GetJobsQueryDto {
  page?: number; // 페이지 번호
  size?: number; // 한 페이지의 항목 수
  region?: string; // 지역별 필터
  experience?: string; // 경력 필터
  salaryFrom?: number; // 최소 급여
  salaryTo?: number; // 최대 급여
  tech?: string; // 기술 스택 필터
  keyword?: string; // 키워드 검색
  companyName?: string; // 회사명 검색
  position?: string; // 포지션 검색
  sort?: string; // 정렬 기준: 필드명:방향 (예: createdAt:desc)
}
