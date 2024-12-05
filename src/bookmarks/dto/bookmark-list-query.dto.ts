import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, IsEnum } from "class-validator";

export class BookmarkListQueryDto {
  @ApiProperty({ required: false, example: 1, description: "페이지 번호 (기본값: 1)" })
  @IsOptional() // 필수 아님
  @IsInt() // 정수 검증
  @Min(1) // 최소값 1
  page?: number; // Default to 1

  @ApiProperty({ required: false, example: 20, description: "페이지당 항목 수 (기본값: 20)" })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number; // Default to 20

  @ApiProperty({
    required: false,
    example: "latest",
    description: "'latest' 또는 'oldest'로 정렬 (기본값: 'latest')",
  })
  @IsOptional()
  @IsEnum(["latest", "oldest"], { message: "'sort'는 'latest' 또는 'oldest'만 허용됩니다." })
  sort?: "latest" | "oldest"; // Default to 'latest'
}
