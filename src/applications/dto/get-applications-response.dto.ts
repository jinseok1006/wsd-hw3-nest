import { ApiProperty } from "@nestjs/swagger";

class JobPostingDto {
  @ApiProperty({
    description: "채용 공고 ID",
    example: 456,
  })
  id: number; // 채용 공고 ID

  @ApiProperty({
    description: "채용 공고 제목",
    example: "Backend Developer",
  })
  title: string; // 채용 공고 제목
}

export class GetApplicationsResponseDto {
  @ApiProperty({
    description: "지원 ID",
    example: 123,
  })
  id: number; // 지원 ID

  @ApiProperty({
    description: "지원자의 이력서 내용",
    example: "이력서 내용이 여기에 포함됩니다.",
  })
  resume: string; // 지원자의 이력서 내용

  @ApiProperty({type: JobPostingDto})
  JobPosting: {
    id: number; // 채용 공고 ID
    title: string; // 채용 공고 제목
  };
}
