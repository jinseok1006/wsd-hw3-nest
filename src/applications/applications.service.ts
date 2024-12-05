import {
  ForbiddenException,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetApplicationsDto } from "./dto/get-applications.dto";
import { GetApplicationsResponseDto } from "./dto/get-applications-response.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CreateApplicationResponseDto } from "./dto/create-application-response.dto";
import { CancelApplicationResponseDto } from "./dto/cancel-application-response.dto";
import { ApplicationCancellationException } from "src/common/custom-error";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  async create(
    userId: number,
    createApplicationDto: CreateApplicationDto
  ): Promise<CreateApplicationResponseDto> {
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
    userId: number, // 인증된 사용자의 ID를 매개변수로 추가
    getApplicationsDto: GetApplicationsDto
  ): Promise<GetApplicationsResponseDto[]> {
    const { status, sortByDate } = getApplicationsDto;

    const applications = await this.prisma.application.findMany({
      where: {
        userId, // 인증된 사용자의 지원 내역만 조회
        ...(status ? { status } : {}), // 상태 필터링 추가 (선택 사항)
      },
      orderBy: { appliedAt: sortByDate || "desc" },
      select: {
        id: true,
        resume: true,
        status: true,
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

  async cancelApplication(
    userId: number,
    applicationId: number
  ): Promise<CancelApplicationResponseDto> {
    // 지원 내역 확인
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    this.logger.debug(
      `userId: ${userId}, application: ${applicationId}로 채용공고 지원 취소 요청`
    );

    if (!application) {
      throw new NotFoundException("해당 지원 내역을 찾을 수 없습니다.");
    }

    // 사용자 인증
    if (application.userId !== userId) {
      throw new ForbiddenException("이 지원 내역을 취소할 권한이 없습니다.");
    }

    // 취소 가능 여부 확인
    if (application.status !== "PENDING") {
      throw new ApplicationCancellationException();
    }

    // 상태 업데이트
    const updatedApplication = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "CANCELED",
      },
    });

    return {
      id: updatedApplication.id,
      userId: updatedApplication.userId,
      jobPostingId: updatedApplication.jobPostingId,
      status: updatedApplication.status,
      updatedAt: updatedApplication.updatedAt,
    };
  }
}
