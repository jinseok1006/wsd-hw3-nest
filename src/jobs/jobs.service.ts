import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetJobsQueryDto } from "./dto/get-jobs-query.dto";
import { GetJobsResponseDto } from "./dto/get-jobs-response.dto";
import { PaginatedData, PaginationDto } from "src/common/response.dto";
import { Prisma } from "@prisma/client";
import { GetJobsDetailResponseDto } from "./dto/get-jobs-detail-response.dto";
import { mapRegion } from "./regionMapper";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}
  // 공고 목록 조회
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

    const take = +size;
    const skip = (page - 1) * take;

    const englishRegion = mapRegion(region);

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
          ? { annualTo: { gte: +annualFrom } } // 최소 경력 조건
          : {},
        annualTo
          ? { annualFrom: { lte: +annualTo } } // 최대 경력 조건
          : {},
      ],
    };

    const validSortFields = ["createdAt", "salary", "views"]; // 유효한 정렬 필드 정의

    const [field, direction] = (sort || "").split(":");

    const orderBy: Prisma.JobPostingOrderByWithRelationInput =
      validSortFields.includes(
        field as keyof Prisma.JobPostingOrderByWithRelationInput
      )
        ? { [field]: direction === "desc" ? "desc" : "asc" }
        : { createdAt: "desc" };

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

    const total = await this.prisma.jobPosting.count({ where });

    const pagination = new PaginationDto(total, Math.ceil(total / take), +page);
    return { data: jobs, pagination };
  }

  // 공고 상세 조회
  async findOne(userId: number, id: number): Promise<GetJobsDetailResponseDto> {
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

    const relatedJobs = await this.prisma.jobPosting.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { region: job.region },
              {
                TechStack: {
                  some: { id: { in: job.TechStack.map((stack) => stack.id) } },
                },
              },
            ],
          },
        ],
      },
      take: 5,
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

    return new GetJobsDetailResponseDto(job, relatedJobs);
  }
}
