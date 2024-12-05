export class CancelApplicationResponseDto {
    id: number; // 지원 내역 ID
    userId: number; // 지원자 ID
    jobPostingId: number; // 채용 공고 ID
    status: string; // 지원 상태 (예: CANCELED)
    updatedAt: Date; // 마지막 업데이트 시간
  }
  