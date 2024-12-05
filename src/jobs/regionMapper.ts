export const regionMap: Record<string, string> = {
  서울: "SEOUL",
  경기: "GYEONGGI",
  광주: "GWANGJU",
  대구: "DAEGU",
  대전: "DAEJEON",
  부산: "BUSAN",
  울산: "ULSAN",
  인천: "INCHEON",
  강원: "GANGWON",
  경남: "GYEONGNAM",
  경북: "GYEONGBUK",
  전남: "JEONNAM",
  전북: "JEONBUK",
  충북: "CHUNGBUK",
  충남: "CHUNGNAM",
  제주: "JEJU",
  세종: "SEJONG",
};

// 매퍼 함수 정의
export function mapRegion(region: string): string | undefined {
  return regionMap[region]; // 키가 없는 경우 기본값 반환
}
