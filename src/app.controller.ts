import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
} from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

// @UseFilters(HttpExceptionFilter)
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('prisma-error')
  async prismaError() {
    const user = await this.prisma.user.create({
      data: {
        email: "hello@test.com",
        name: "hello",
        hashedPassword: "hello",
      },
    });
    return user;
  }

  @Get('internal-error') 
  async internalServerError() {
    throw new InternalServerErrorException();
  }
}
