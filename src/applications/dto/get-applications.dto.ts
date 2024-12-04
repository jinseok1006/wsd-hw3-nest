// 지원 내역 조회 DTO (필터링 및 정렬에 사용)
export class GetApplicationsDto {
    status?: string; // 지원 상태 필터 (예: "PENDING", "APPROVED")
    sortByDate?: 'asc' | 'desc'; // 날짜 정렬 기준 (오름차순/내림차순)
  }
  