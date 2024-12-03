// src/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'some-refresh-token' })
  refresh_token: string;
}