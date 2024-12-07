import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthCoreModule } from "src/auth-core/auth-core.module";

@Module({
  imports: [AuthCoreModule, PrismaModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
