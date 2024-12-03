// src/users/users.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { Base64Encoder } from "src/utils/base64Encorder";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    // Encode the password using Base64
    const encodedPassword = Base64Encoder.encode(data.password);

    // Create user with encoded password
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        hashedPassword: encodedPassword,
      },
    });

    return new UserResponseDto(user);
  }

  async updateUser(userId: number, updateData: UpdateUserDto): Promise<UserResponseDto> {
    // 

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: updateData.email,
        name: updateData.name,
        hashedPassword: updateData.password ? Base64Encoder.encode(updateData.password) : undefined,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return new UserResponseDto(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
