// src/auth/dto/refresh-token-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'example_access_token' })
  access_token: string;

  constructor(data: { access_token: string }) {
    this.access_token = data.access_token;
  }
}