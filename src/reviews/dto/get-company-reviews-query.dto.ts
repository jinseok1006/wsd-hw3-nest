// 전체검색용?? 말이좀 안되는데?
export class GetCompanyReviewsQueryDto {
  page?: number; // 페이지 번호 (기본값: 1)
  size?: number; // 한 페이지에 표시할 리뷰 수 (기본값: 10)
  sortByDate?: "asc" | "desc"; // 리뷰 작성 날짜 정렬 (기본값: desc)
  minRating?: number; // 최소 평점 필터
  maxRating?: number; // 최대 평점 필터
}
