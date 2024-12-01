import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  result: T;

  @ApiProperty({
    example: {
      currentPage: 1,
      totalItems: 100,
      totalPages: 10,
    },
    required: false,
  })
  pagination?: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export class ErrorResponseDto {
  @ApiProperty()
  error: string;
  @ApiProperty()
  message: string[];

  @ApiProperty()
  statusCode: string;
}
