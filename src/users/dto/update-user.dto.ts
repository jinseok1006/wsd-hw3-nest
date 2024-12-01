import { IsEmail, IsOptional, IsString } from "class-validator";
// src/users/dto/update-user.dto.ts

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
