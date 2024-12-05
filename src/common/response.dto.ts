import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  constructor(currentPage: number, totalItems: number, totalPages: number) {
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
  }
}

export class PaginatedData<T> {
  data: T[];
  pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto) {
    this.data = data;
    this.pagination = pagination;
  }
}

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
  pagination?: PaginationDto;

  constructor(result: T, pagination?: PaginationDto) {
    this.success = true;
    this.result = result;
    this.pagination = pagination;
  }
}

export class ErrorResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  error: string;
  @ApiProperty()
  message: string[];

  @ApiProperty()
  statusCode: number;

  constructor(error: string, message: string[], statusCode: number) {
    this.success = false;
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
}
