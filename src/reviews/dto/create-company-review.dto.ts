import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, Min, Max, IsString, MaxLength } from "class-validator";

export class CreateCompanyReviewDto {
  @ApiProperty({
    description: "리뷰할 회사 ID",
    example: 123,
  })
  @IsInt({ message: "companyId는 정수여야 합니다." }) // 정수 검증
  @IsPositive({ message: "companyId는 양수여야 합니다." }) // 양수 검증
  companyId: number;

  @ApiProperty({
    description: "평점 (1~5)",
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: "rating은 정수여야 합니다." }) // 정수 검증
  @Min(1, { message: "rating은 1 이상이어야 합니다." }) // 최소값 검증
  @Max(5, { message: "rating은 5 이하여야 합니다." }) // 최대값 검증
  rating: number;

  @ApiProperty({
    description: "리뷰 내용",
    example: "회사의 업무 환경이 좋습니다.",
    maxLength: 500,
  })
  @IsString({ message: "content는 문자열이어야 합니다." }) // 문자열 검증
  @MaxLength(500, { message: "content는 최대 500자까지 가능합니다." }) // 최대 길이 검증
  content: string;
}
