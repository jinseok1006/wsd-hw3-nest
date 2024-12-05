import { Injectable } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetApplicationsDto } from "./dto/get-applications.dto";
import { GetApplicationsResponseDto } from "./dto/get-applications-response.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createApplicationDto: CreateApplicationDto) {
    const { jobPostingId, resume } = createApplicationDto;

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
        resume,
        status: "PENDING",
      },
    });
  }

  async getApplications(
    getApplicationsDto: GetApplicationsDto
  ): Promise<GetApplicationsResponseDto[]> {
    const { status, sortByDate } = getApplicationsDto;

    const applications = this.prisma.application.findMany({
      where: status ? { status } : {},
      orderBy: { appliedAt: sortByDate || "desc" },
      select: {
        id: true,
        resume: true,
        JobPosting: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return applications;
  }
}
