import { ApiProperty } from "@nestjs/swagger";

export class CancelApplicationResponseDto {
  @ApiProperty({
    description: "지원 내역 ID",
    example: 123,
  })
  id: number; // 지원 내역 ID

  @ApiProperty({
    description: "지원자 ID",
    example: 456,
  })
  userId: number; // 지원자 ID

  @ApiProperty({
    description: "채용 공고 ID",
    example: 789,
  })
  jobPostingId: number; // 채용 공고 ID

  @ApiProperty({
    description: "지원 상태 (예: CANCELED)",
    example: "CANCELED",
  })
  status: string; // 지원 상태 (예: CANCELED)

  @ApiProperty({
    description: "마지막 업데이트 시간",
    example: "2024-12-05T10:00:00.000Z",
  })
  updatedAt: Date; // 마지막 업데이트 시간
}
