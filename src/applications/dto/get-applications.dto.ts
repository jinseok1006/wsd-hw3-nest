import { ApiProperty } from "@nestjs/swagger";
import { Application_status } from "@prisma/client";
import { IsOptional, IsEnum } from "class-validator";

export class GetApplicationsDto {
  @ApiProperty({
    description: "지원 상태 필터",
    required: false,
    enum: Application_status, // Prisma에서 제공하는 ENUM 사용
    example: "PENDING",
  })
  @IsOptional()
  @IsEnum(Application_status, {
    message: "status는 PENDING, APPROVED, REJECTED 중 하나여야 합니다.",
  })
  status?: Application_status; // 지원 상태 필터

  @ApiProperty({
    description: "날짜 정렬 기준 (오름차순: 'asc', 내림차순: 'desc')",
    required: false,
    enum: ["asc", "desc"], // 가능한 값 명시
    example: "desc",
  })
  @IsOptional()
  @IsEnum(["asc", "desc"], {
    message: "sortByDate는 'asc' 또는 'desc' 중 하나여야 합니다.",
  })
  sortByDate?: "asc" | "desc"; // 날짜 정렬 기준
}
