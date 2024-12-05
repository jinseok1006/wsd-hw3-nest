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
    description: "이력서 URL",
    example: "https://example.com/resume.pdf",
  })
  resume: string; 

  @ApiProperty({type: JobPostingDto})
  JobPosting: JobPostingDto;
}
