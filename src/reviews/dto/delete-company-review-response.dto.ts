import { ApiProperty } from '@nestjs/swagger';

export class DeleteCompanyReviewResponseDto {
  @ApiProperty({
    description: '삭제된 리뷰 ID',
    example: 1,
  })
  id: number; // 삭제된 리뷰 ID
}
