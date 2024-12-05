import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationResponseDto {
  @ApiProperty({
    description: "생성된 지원의 고유 ID",
    example: 123,
  })
  id: number; // 생성된 지원의 고유 ID

  @ApiProperty({
    description: "지원한 사용자 ID",
    example: 456,
  })
  userId: number; // 지원한 사용자 ID

  @ApiProperty({
    description: "지원한 채용공고 ID",
    example: 789,
  })
  jobPostingId: number; // 지원한 채용공고 ID

  @ApiProperty({
    description: "지원 상태 (예: PENDING)",
    example: "PENDING",
  })
  status: string; // 지원 상태 (e.g., PENDING)

  @ApiProperty({
    description: "지원한 시간",
    example: "2024-12-05T10:00:00.000Z",
  })
  appliedAt: Date; // 지원한 시간

  @ApiProperty({
    description: "이력서 URL",
    example: "https://example.com/resume.pdf",
    required: false,
  })
  resume?: string; // 선택적으로 포함된 이력서 내용
}
