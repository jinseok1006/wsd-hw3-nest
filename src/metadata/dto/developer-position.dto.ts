import { ApiProperty } from '@nestjs/swagger';

export class DeveloperPositionDto {
  @ApiProperty({ example: 1, description: '개발자 직무의 고유 식별자' })
  id: number;

  @ApiProperty({ example: 'backend', description: '직무명(문자열)' })
  name: string;
}
