export class GetApplicationsResponseDto {
  id: number; // 지원 ID
  resume: string; // 지원자의 이력서 내용
  JobPosting: {
    id: number; // 채용 공고 ID
    title: string; // 채용 공고 제목
  };
}
