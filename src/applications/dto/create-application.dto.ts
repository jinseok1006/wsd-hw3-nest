import { ApiProperty } from "@nestjs/swagger";

// 지원 생성 DTO (지원하기 요청에 사용)
export class CreateApplicationDto {
  @ApiProperty()
  jobPostingId: number; // 채용 공고 ID
  @ApiProperty()
  resume?: string; // 이력서 내용 (선택 입력)
}
