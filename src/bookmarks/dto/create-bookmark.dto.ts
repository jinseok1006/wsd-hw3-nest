import { ApiProperty } from "@nestjs/swagger";

export class CreateBookmarkDto {
    @ApiProperty()
    jobPostingId: number;
  }
  