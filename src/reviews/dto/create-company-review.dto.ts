import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyReviewDto {
  @ApiProperty()
  companyId: number; // 리뷰할 회사 ID
  @ApiProperty()
  rating: number; // 평점 (1~5)
  @ApiProperty()
  content: string; // 리뷰 내용
}
