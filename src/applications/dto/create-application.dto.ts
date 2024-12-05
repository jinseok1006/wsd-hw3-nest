import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateApplicationDto {
  @ApiProperty({
    description: "지원할 채용 공고의 ID",
    example: 123,
  })
  @IsInt({ message: "jobPostingId는 정수여야 합니다." }) // 정수 검증
  @Min(1, { message: "jobPostingId는 1 이상의 값을 가져야 합니다." }) // 최소값 검증
  jobPostingId: number;

  @ApiProperty({
    description: "이력서 URL (선택 입력)",
    required: false,
    example: "https://example.com/resume.pdf",
  })
  @IsOptional() // 선택적 필드임을 명시
  @IsString({ message: "resume은 문자열이어야 합니다." }) // 문자열 검증
  @MaxLength(200, { message: "resume은 최대 200자까지 가능합니다." }) // 최대 길이 검증
  resume?: string;
}
