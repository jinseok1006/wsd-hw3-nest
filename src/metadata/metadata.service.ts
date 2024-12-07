import { Injectable } from "@nestjs/common";
import { DeveloperPositionDto } from "./dto/developer-position.dto";
import { TechStackDto } from "./dto/tech-stack.dto";
import { PrismaService } from "../prisma/prisma.service"; // Prisma를 사용하는 경우

@Injectable()
export class MetadataService {
  constructor(private readonly prisma: PrismaService) {}

  // 개발자 직무 리스트 가져오기
  async getDeveloperPositions(): Promise<DeveloperPositionDto[]> {
    const positions = await this.prisma.developerPosition.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return positions;
  }

  // 기술 스택 리스트 가져오기
  async getTechStacks(): Promise<TechStackDto[]> {
    const stacks = await this.prisma.techStack.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return stacks;
  }
}
