import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { IsInt, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/common/response.dto";

import { ApiCommonResponses } from "src/common/api.response.decorator";

class CreateUserDto {
  @IsString()
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly email: string;
  @IsInt()
  @ApiProperty()
  readonly age: number;

  constructor(name: string, email: string, age: number) {
    this.name = name;
    this.email = email;
    this.age = age;
  }
}

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCommonResponses()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    return {
      success: true,
      result: {
        createdAt: new Date(),
        email: "hello@test",
        id: 1,
        name: "DiffieHellmanGroup",
        updatedAt: new Date(),
      },
      pagination: {
        currentPage: 1,
        totalItems: 2,
        totalPages: 3,
      },
    };
  }
}
