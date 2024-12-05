import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function JobsApiQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: '페이지 번호',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: '페이지 당 항목 수',
    }),
    ApiQuery({
      name: 'region',
      required: false,
      type: String,
      description: '지역별 필터링(서울, 경기, 광주, 대구, 대전, 부산, 울산, 인천, 강원, 경남, 경북, 전남, 전북, 충북, 충남, 제주, 세종)',
    }),
    ApiQuery({
      name: 'salaryFrom',
      required: false,
      type: Number,
      description: '최소 연봉 필터링(ex. 2000)',
    }),
    ApiQuery({
      name: 'salaryTo',
      required: false,
      type: Number,
      description: '최대 연봉 필터링(ex. 9000)',
    }),
    ApiQuery({
      name: 'tech',
      required: false,
      type: String,
      description: '기술 스택 필터링(원티드 참조)',
    }),
    ApiQuery({
      name: 'keyword',
      required: false,
      type: String,
      description: '키워드 검색',
    }),
    ApiQuery({
      name: 'companyName',
      required: false,
      type: String,
      description: '회사 이름 검색',
    }),
    ApiQuery({
      name: 'position',
      required: false,
      type: String,
      description: '개발자 포지션 검색(원티드 개발직군 직무참조)',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      description: '정렬 필드 및 순서 (예: createdAt:desc, salary:asc)',
    }),
  );
}
