// src/auth/dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'some-refresh-token' })
  @IsString()
  refresh_token: string;
}