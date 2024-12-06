import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, Max, IsNumber, IsEnum } from "class-validator";

export class GetCompanyReviewsQueryDto {
  @ApiProperty({
    description: "페이지 번호 (기본값: 1)",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1; // 페이지 번호 (기본값: 1)

  @ApiProperty({
    description: "한 페이지에 표시할 리뷰 수 (기본값: 10)",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number = 10; // 한 페이지에 표시할 리뷰 수 (기본값: 10)

  @ApiProperty({
    description: "리뷰 작성 날짜 정렬 (기본값: desc)",
    example: "desc",
    required: false,
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortByDate?: "asc" | "desc" = "desc"; // 리뷰 작성 날짜 정렬 (기본값: desc)

  @ApiProperty({
    description: "최소 평점 필터",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number; // 최소 평점 필터

  @ApiProperty({
    description: "최대 평점 필터",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRating?: number; // 최대 평점 필터
}
