// src/users/dto/user-response.dto.ts
// import { User } from "@prisma/client";


export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;

  constructor(user: {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.role = user.role;
    // 주의: hashedPassword는 의도적으로 제외되었습니다.
  }
}
