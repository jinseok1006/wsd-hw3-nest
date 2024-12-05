import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "사용자 이메일",
    example: "user@example.com",
  })
  email: string;

  @ApiProperty({
    description: "사용자 이름",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "사용자 역할 (예: admin, user 등)",
    example: "user",
  })
  role: string;

  constructor(user: {
    id: number;
    email: string;
    name: string;
    role: string;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    // 주의: hashedPassword는 의도적으로 제외되었습니다.
  }
}
