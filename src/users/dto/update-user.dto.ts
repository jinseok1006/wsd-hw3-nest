import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
// src/users/dto/update-user.dto.ts

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'new-email@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'New Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
