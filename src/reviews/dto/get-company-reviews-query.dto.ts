export class GetCompanyReviewsQueryDto {
  sortByDate?: "asc" | "desc"; // 날짜 정렬 (기본: desc)
  minRating?: number; // 최소 평점 필터링
  maxRating?: number; // 최대 평점 필터링
}
