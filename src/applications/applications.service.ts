import { Injectable } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const { userId, jobPostingId, resume } = createApplicationDto;

    // 중복 지원 확인
    const existingApplication = await this.prisma.application.findUnique({
      where: { userId_jobPostingId: { userId, jobPostingId } },
    });

    if (existingApplication) {
      throw new Error("이미 지원한 공고입니다.");
    }

    return this.prisma.application.create({
      data: {
        userId,
        jobPostingId,
        resume: resume || "",
        status: "PENDING",
      },
    });
  }
}
