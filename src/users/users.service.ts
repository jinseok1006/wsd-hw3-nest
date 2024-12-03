// src/users/users.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { Base64Encoder } from "src/utils/base64Encoder";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// 커스텀 예외 클래스 임포트
import {
  UserNotFoundException,
  EmailAlreadyExistsException,
} from "src/common/custom-error";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    // 이메일 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    // 비밀번호 인코딩
    const encodedPassword = Base64Encoder.encode(data.password);

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        hashedPassword: encodedPassword,
      },
    });

    return new UserResponseDto(user);
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    // DTO에서 password를 제외한 나머지 필드 추출 및 업데이트 데이터 준비
    const { password, ...rest } = data;

    // 비밀번호가 있는 경우 해싱하여 업데이트 데이터에 포함
    const updateData = {
      ...rest,
      hashedPassword: password ? Base64Encoder.encode(password) : undefined,
    };

    // 사용자 업데이트
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return new UserResponseDto(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
