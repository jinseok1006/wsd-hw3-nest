import { Module } from "@nestjs/common";
import { BookmarksController } from "./bookmarks.controller";
import { BookmarksService } from "./bookmarks.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { TokenModule } from "src/token/token.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule,TokenModule, JwtModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
