import {
  ConflictException,
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
import { CacheKeyHelper } from "src/common/cache/cache-key-helper";
import { CacheService } from "src/cache/cache.service";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService
  ) {}

  /**
   * 새로운 지원을 생성합니다.
   * @param userId 지원하는 사용자의 ID
   * @param createApplicationDto 지원 생성에 필요한 데이터 (jobPostingId, resume 등)
   * @returns 생성된 지원 내역
   * @throws ConflictException 중복 지원이 발생할 경우 예외 발생
   */
  async create(
    userId: number,
    createApplicationDto: CreateApplicationDto
  ): Promise<CreateApplicationResponseDto> {
    const { jobPostingId, resume } = createApplicationDto;

    // 중복 지원 여부 확인
    const existingApplication = await this.prisma.application.findUnique({
      where: { userId_jobPostingId: { userId, jobPostingId } },
    });

    if (existingApplication) {
      throw new ConflictException("이미 지원한 공고입니다.");
    }

    // 캐시제거
    this.cacheService.invalidateApplicationsCache(userId);

    return this.prisma.application.create({
      data: {
        userId,
        jobPostingId,
        resume,
        status: "PENDING",
      },
    });
  }

  /**
   * 사용자가 지원한 내역을 조회합니다.
   * @param userId 인증된 사용자의 ID
   * @param getApplicationsDto 필터링 옵션 (status, sortByDate 등)
   * @returns 지원 내역 목록
   */
  async getApplications(
    userId: number,
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

  /**
   * 사용자가 지원한 내역을 취소합니다.
   * @param userId 인증된 사용자의 ID
   * @param applicationId 취소할 지원 ID
   * @returns 취소된 지원 내역
   * @throws NotFoundException 지원 내역이 존재하지 않을 경우
   * @throws ForbiddenException 해당 내역을 취소할 권한이 없을 경우
   * @throws ApplicationCancellationException 지원 상태가 PENDING이 아니면 취소 불가
   */
  async cancelApplication(
    userId: number,
    applicationId: number
  ): Promise<CancelApplicationResponseDto> {
    // 지원 내역 존재 여부 확인
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    this.logger.debug(
      `userId: ${userId}, application: ${applicationId}로 채용공고 지원 취소 요청`
    );

    if (!application) {
      throw new NotFoundException("해당 지원 내역을 찾을 수 없습니다.");
    }

    // 사용자가 해당 지원 내역을 취소할 권한이 있는지 확인
    if (application.userId !== userId) {
      throw new ForbiddenException("이 지원 내역을 취소할 권한이 없습니다.");
    }

    // 지원 상태가 PENDING인지 확인
    if (application.status !== "PENDING") {
      throw new ApplicationCancellationException();
    }

    // 지원 상태를 CANCELED로 업데이트
    const updatedApplication = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "CANCELED",
      },
    });

    // 캐시제거
    this.cacheService.invalidateApplicationsCache(userId);


    return {
      id: updatedApplication.id,
      userId: updatedApplication.userId,
      jobPostingId: updatedApplication.jobPostingId,
      status: updatedApplication.status,
      updatedAt: updatedApplication.updatedAt,
    };
  }
}
