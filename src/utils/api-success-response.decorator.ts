import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/common/response.dto";

/**
 * SuccessResponse 데코레이터
 * @param dto 내부 제네릭 타입 (예: LoginResponseDto)
 * @param description 응답 설명
 * @param includePagination Pagination 필드 포함 여부
 */
export function ApiSuccessResponse(
  dto: any,
  description: string,
  includePagination = false
) {
  return applyDecorators(
    ApiExtraModels(dto), // 내부 모델을 Swagger에 등록
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) }, // SuccessResponseDto의 스키마 참조
          {
            properties: {
              result: { $ref: getSchemaPath(dto) }, // 내부 제네릭 타입(DTO)을 참조
              ...(includePagination && {
                pagination: { $ref: getSchemaPath("PaginationDto") }, // Pagination 필드 동적 추가
              }),
            },
          },
        ],
      },
    })
  );
}
