export class CreateCompanyReviewResponseDto {
  id: number; // 리뷰 ID
  userId: number; // 작성자 ID
  companyId: number; // 회사 ID
  rating: number; // 평점
  content: string; // 리뷰 내용
  createdAt: Date; // 생성된 시간
  updatedAt: Date; // 수정된 시간
}
