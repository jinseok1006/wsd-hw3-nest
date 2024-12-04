// 지원 생성 DTO (지원하기 요청에 사용)
export class CreateApplicationDto {
  userId: number; // 사용자 ID
  jobPostingId: number; // 채용 공고 ID
  resume?: string; // 이력서 내용 (선택 입력)
}
