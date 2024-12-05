import { ApiProperty } from "@nestjs/swagger";

export class BookMarkSummary {
  @ApiProperty({ example: 101 })
  id: number;
  @ApiProperty({ example: 123 })
  jobPostingId: number;
}


export class GetJobsResponseDto {
  @ApiProperty({
    description: "공고 ID",
    example: 123,
  })
  id: number; // 공고 ID

  @ApiProperty({
    description: "공고 이미지 URL",
    example: "https://example.com/image.jpg",
  })
  image: string;

  @ApiProperty({
    description: "공고 제목",
    example: "Frontend Developer",
  })
  title: string; // 공고 제목

  @ApiProperty({
    description: "상세 위치 설명",
    example: "서울 강남구",
  })
  locationDescription: string; // 상세 위치 설명

  @ApiProperty({
    description: "연차 최소값",
    example: 3,
  })
  annualFrom: number; // 연차 최소값

  @ApiProperty({
    description: "연차 최대값",
    example: 5,
  })
  annualTo: number; // 연차 최대값

  @ApiProperty({
    description: "회사 정보",
    example: { id: 1, name: "ABC Corp" },
  })
  Company: {
    id: number;
    name: string;
  };

  // @ApiProperty({
  //   description: "북마크 정보",
  //   type: "array", // 배열임을 명시
  //   items: {
  //     type: "object",
  //     properties: {
  //       id: { type: "number", example: 101 },
  //       jobPostingId: { type: "number", example: 123 },
  //     },
  //   },
  //   example: [{ id: 101, jobPostingId: 123 }],
  // })
  // 본인의 북마크 여부만 전달
  @ApiProperty({ type: [BookMarkSummary] })
  Bookmark: {
    id: number;
    jobPostingId: number;
  }[]; // 북마크 여부
}

