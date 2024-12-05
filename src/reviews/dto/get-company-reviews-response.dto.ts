export class GetCompanyReviewsResponseDto {
  id: number; // 리뷰 ID
  userId: number; // 작성자 ID
  rating: number; // 평점
  content: string; // 리뷰 내용
  createdAt: Date; // 생성 시간
}
