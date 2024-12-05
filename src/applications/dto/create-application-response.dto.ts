export class CreateApplicationResponseDto {
    id: number; // 생성된 지원의 고유 ID
    userId: number; // 지원한 사용자 ID
    jobPostingId: number; // 지원한 채용공고 ID
    status: string; // 지원 상태 (e.g., PENDING)
    appliedAt: Date; // 지원한 시간
    resume?: string; // 선택적으로 포함된 이력서 내용
  }
  