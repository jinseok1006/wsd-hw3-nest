import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // PrismaService는 Prisma Client를 래핑한 서비스입니다.
import { CompanyDto } from "./dto/company-response.dto";

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 모든 회사를 가져옵니다.
   * @returns 회사 리스트
   */
  async getAllCompanies(): Promise<CompanyDto[]> {
    return this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
