import { JobSummaryDto } from "./get-jobs-response.dto";

export class JobDetailDto {
  id: number; // 공고 ID
  title: string; // 공고 제목
  description: string; // 공고 내용
  region: string; // 지역
  salary: number; // 급여
  benefits?: string; // 복리후생
  hireRound?: string; // 채용 단계
  company: {
    id: number; // 회사 ID
    name: string; // 회사명
    image?: string; // 회사 이미지
  };
  techStacks: string[]; // 기술 스택 리스트
  relatedJobs: JobSummaryDto[]; // 관련 공고 리스트
}
