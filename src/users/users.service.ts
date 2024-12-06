// src/users/users.service.ts
import { Inject, Injectable, LoggerService } from "@nestjs/common";
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
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CacheKeyHelper } from "src/common/cache/cache-key-helper";

/**
 * 사용자 서비스: 사용자 생성, 조회, 수정, 삭제 기능 제공
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  /**
   * 모든 사용자를 조회합니다.
   * @returns 사용자 목록
   */
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * ID로 사용자를 조회합니다.
   * @param id 조회할 사용자 ID
   * @returns 사용자 정보
   * @throws UserNotFoundException 사용자가 존재하지 않을 경우
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException(); // 사용자 존재하지 않을 경우 예외 발생
    }

    return user;
  }

  /**
   * 새 사용자를 생성합니다.
   * @param data 사용자 생성에 필요한 데이터 (이메일, 이름, 비밀번호)
   * @returns 생성된 사용자 정보
   * @throws EmailAlreadyExistsException 이메일이 중복된 경우
   */
  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    // 이메일 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsException(); // 이메일 중복 예외 발생
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

  /**
   * 사용자를 수정합니다.
   * @param id 수정할 사용자 ID
   * @param data 사용자 수정 데이터 (이름, 이메일, 비밀번호 등)
   * @returns 수정된 사용자 정보
   * @throws UserNotFoundException 사용자가 존재하지 않을 경우
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const { password, ...rest } = data;

    const updateData = {
      ...rest,
      hashedPassword: password ? Base64Encoder.encode(password) : undefined,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // 캐시 키 생성 및 삭제
    const cacheKey = CacheKeyHelper.generateKey("GET", "/auth/profile", id);
    await this.cacheManager.del(cacheKey);

    this.logger.debug({
      message: `Cache invalidated for key: ${cacheKey}`,
      context: UsersService.name,
    });

    return new UserResponseDto(updatedUser);
  }
  /**
   * 사용자를 삭제합니다.
   * @param id 삭제할 사용자 ID
   * @throws UserNotFoundException 사용자가 존재하지 않을 경우
   */
  // async deleteUser(id: number): Promise<void> {
  //   // 사용자 존재 여부 확인
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });

  //   if (!user) {
  //     throw new UserNotFoundException(); // 사용자 존재하지 않을 경우 예외 발생
  //   }

  //   // 사용자 삭제
  //   await this.prisma.user.delete({
  //     where: { id },
  //   });
  // }
}
