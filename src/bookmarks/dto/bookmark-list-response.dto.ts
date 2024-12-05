import { ApiProperty } from "@nestjs/swagger";

export class JobPostingSummaryDto {
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
}

export class BookmarkListDto {
  @ApiProperty({
    description: "북마크 ID",
    example: 101,
  })
  id: number;

  @ApiProperty({
    description: "북마크된 채용 공고 정보",
    type: JobPostingSummaryDto,
  })
  JobPosting: JobPostingSummaryDto;
}

// export class BookmarkListResponseDto {
//   @ApiProperty({
//     description: "북마크 목록",
//     type: [BookmarkListDto],
//   })
//   bookmarks: BookmarkListDto[];

//   @ApiProperty({
//     description: "페이지네이션 정보",
//     type: PaginationDto,
//   })
//   pagination: PaginationDto;

//   constructor(bookmarks: BookmarkListDto[], pagination: PaginationDto) {
//     this.bookmarks = bookmarks;
//     this.pagination = pagination;
//   }
// }
