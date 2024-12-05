import { ApiProperty } from '@nestjs/swagger';

export class CompanyReviewResponseDto {
  @ApiProperty({
    description: '리뷰 ID',
    example: 1,
  })
  id: number; // 리뷰 ID

  @ApiProperty({
    description: '작성자 ID',
    example: 123,
  })
  userId: number; // 작성자 ID

  @ApiProperty({
    description: '회사 ID',
    example: 456,
  })
  companyId: number; // 회사 ID

  @ApiProperty({
    description: '평점 (1~5 사이의 정수)',
    example: 4,
  })
  rating: number; // 평점

  @ApiProperty({
    description: '리뷰 내용',
    example: '회사의 근무 환경이 훌륭합니다.',
  })
  content: string; // 리뷰 내용

}
