import { ApiProperty } from '@nestjs/swagger';

export class TechStackDto {
  @ApiProperty({ example: 1, description: '기술 스택의 고유 식별자' })
  id: number;

  @ApiProperty({ example: 'TypeScript', description: '기술 스택명' })
  name: string;
}
