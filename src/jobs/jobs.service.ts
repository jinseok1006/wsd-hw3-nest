import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetJobsQueryDto } from "./dto/get-jobs-query.dto";
import { GetJobsResponseDto } from "./dto/get-jobs-response.dto";
import { PaginatedData, PaginationDto } from "src/common/response.dto";
import { Prisma } from "@prisma/client";
import { GetJobsDetailResponseDto } from "./dto/get-jobs-detail-response.dto";
import { mapRegion } from "./regionMapper";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

/**
 * 공고 서비스: 채용 공고와 관련된 비즈니스 로직 처리
 * - 공고 목록 조회
 * - 공고 상세 조회
 * - 관련 공고 조회
 */
@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  /**
   * 공고 목록을 조회합니다.
   * @param userId 사용자 ID (북마크 확인용)
   * @param query 공고 조회를 위한 필터링 및 정렬 옵션
   * @returns 공고 목록과 페이지네이션 정보
   */
  async findAll(
    userId: number,
    query: GetJobsQueryDto
  ): Promise<PaginatedData<GetJobsResponseDto>> {
    const {
      page = 1,
      size = 20,
      region,
      salaryFrom,
      salaryTo,
      tech,
      keyword,
      companyName,
      position,
      sort,
      annualFrom,
      annualTo,
    } = query;

    const take = +size; // 페이지당 항목 수
    const skip = (page - 1) * take; // 페이지 오프셋 계산

    const englishRegion = mapRegion(region); // 지역 필터를 영문으로 매핑

    // 검색 조건 작성
    const where: any = {
      AND: [
        englishRegion ? { region: englishRegion } : {},
        salaryFrom ? { salary: { gte: +salaryFrom } } : {},
        salaryTo ? { salary: { lte: +salaryTo } } : {},
        tech ? { TechStack: { some: { name: { contains: tech } } } } : {},
        keyword
          ? {
              OR: [
                { title: { contains: keyword } },
                { description: { contains: keyword } },
              ],
            }
          : {},
        companyName
          ? {
              Company: { name: { contains: companyName } },
            }
          : {},
        position
          ? {
              DeveloperPosition: {
                some: { name: { contains: position } },
              },
            }
          : {},
        annualFrom
          ? { annualTo: { gte: +annualFrom } } // 최소 경력 필터
          : {},
        annualTo
          ? { annualFrom: { lte: +annualTo } } // 최대 경력 필터
          : {},
      ],
    };

    // 정렬 조건 설정
    const validSortFields = ["createdAt", "salary", "views"];
    const [field, direction] = (sort || "").split(":");

    const orderBy: Prisma.JobPostingOrderByWithRelationInput =
      validSortFields.includes(
        field as keyof Prisma.JobPostingOrderByWithRelationInput
      )
        ? { [field]: direction === "desc" ? "desc" : "asc" }
        : { createdAt: "desc" }; // 기본값: 생성일 내림차순

    // 공고 목록 조회
    const jobs = await this.prisma.jobPosting.findMany({
      where,
      take,
      skip,
      orderBy,
      select: {
        id: true,
        title: true,
        locationDescription: true,
        annualFrom: true,
        annualTo: true,
        image: true,
        Company: {
          select: {
            id: true,
            name: true,
          },
        },
        Bookmark: {
          where: {
            userId,
          },
          select: {
            id: true,
            jobPostingId: true,
          },
        },
      },
    });

    // 총 공고 수 계산
    const total = await this.prisma.jobPosting.count({ where });

    // 페이지네이션 데이터 생성
    const pagination = new PaginationDto(total, Math.ceil(total / take), +page);
    return { data: jobs, pagination };
  }

  /**
   * 공고 상세 정보를 조회합니다.
   * @param userId 사용자 ID (북마크 확인용)
   * @param id 조회할 공고 ID
   * @returns 공고 상세 정보와 관련 공고 목록
   * @throws NotFoundException 공고가 존재하지 않을 경우
   */
  async findOne(userId: number, id: number): Promise<GetJobsDetailResponseDto> {
    // 1. Job ID 존재 여부 확인
    const jobExists = await this.prisma.jobPosting.findUnique({
      where: { id },
      select: { id: true },
    });

    this.logger.debug(`JobExists ${jobExists}`); // 디버깅을 위한 로그

    if (!jobExists) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // 2. Job 조회 및 조회수 증가
    const job = await this.prisma.jobPosting.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        Company: {
          select: {
            id: true,
            name: true,
          },
        },
        TechStack: {
          select: {
            id: true,
            name: true,
          },
        },
        DeveloperPosition: {
          select: {
            name: true,
          },
        },
        Bookmark: {
          where: { userId },
          select: {
            id: true,
            jobPostingId: true,
          },
        },
      },
    });

    // 3. 관련 공고 조회
    const relatedJobs = await this.prisma.jobPosting.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { region: job.region }, // 동일 지역 공고
              {
                TechStack: {
                  some: { id: { in: job.TechStack.map((stack) => stack.id) } }, // 동일 기술 스택 공고
                },
              },
            ],
          },
        ],
      },
      take: 5, // 최대 5개 조회
      select: {
        id: true,
        title: true,
        locationDescription: true,
        annualFrom: true,
        annualTo: true,
        image: true,
        Company: {
          select: {
            id: true,
            name: true,
          },
        },
        Bookmark: {
          where: { userId },
          select: {
            id: true,
            jobPostingId: true,
          },
        },
      },
    });

    // 4. 결과 반환
    return new GetJobsDetailResponseDto(job, relatedJobs);
  }
}
