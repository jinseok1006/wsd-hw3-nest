import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class CreateBookmarkDto {
  @ApiProperty({
    description: "북마크할 Job Posting의 ID",
    example: 123,
  })
  @IsInt({ message: "jobPostingId는 정수여야 합니다." }) // 정수 확인
  @IsPositive({ message: "jobPostingId는 양수여야 합니다." }) // 양수 확인
  jobPostingId: number;
}
