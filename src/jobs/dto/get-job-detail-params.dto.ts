import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class GetJobDetailParamsDto {
  @ApiProperty({
    description: "공고 ID",
    example: 123,
  })
  @IsInt({ message: "id는 정수여야 합니다." }) // 정수 검증
  @Min(1, { message: "id는 1 이상의 값을 가져야 합니다." }) // 최소값 검증
  id: number; // 공고 ID
}
