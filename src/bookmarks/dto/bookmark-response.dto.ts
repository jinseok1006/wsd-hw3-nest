import { ApiProperty } from "@nestjs/swagger";

export class BookmarkResponseDto {
  @ApiProperty({
    description: "북마크 ID",
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: "북마크 상태",
    example: "bookmarked",
  })
  status: "bookmarked" | "unbookmarked"; // 상태를 직관적으로 표현
}
