import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiCommonResponses } from "src/common/api.response.decorator";
import { SuccessResponseDto } from "src/common/response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    // private readonly logger: Logger,
    private readonly usersService: UsersService
  ) {}

  @Post("register")
  @ApiCommonResponses()
  async create(
    @Body() body: any
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    const user = await this.usersService.createUser(body);

    return new SuccessResponseDto(user);
  }
}
