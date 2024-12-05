// src/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'example_access_token' })
  access_token: string;

  @ApiProperty({ example: 'example_refresh_token' })
  refresh_token: string;

  constructor(data: { access_token: string; refresh_token: string }) {
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
  }
}