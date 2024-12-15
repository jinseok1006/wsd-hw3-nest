import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
  @ApiProperty({ example: 1, description: '회사 ID' })
  id: number;

  @ApiProperty({ example: 'Tech Corp', description: '회사 이름' })
  name: string;

}
