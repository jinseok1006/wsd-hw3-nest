export class GetJobsResponseDto {
  id: number; // 공고 ID
  image: string;
  title: string; // 공고 제목
  locationDescription: string; // 상세 위치 설명
  annualFrom: number; // 연차 최소값
  annualTo: number; // 연차 최대값
  Company: {
    id: number;
    name: string;
  };
  Bookmark: {
    id: number;
    jobPostingId: number;
  }[];
  // 북마크 여부
}
