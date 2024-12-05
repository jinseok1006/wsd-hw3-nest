import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from "@nestjs/swagger";
import { SuccessResponseDto } from "src/common/response.dto";

/**
 * SuccessResponse 데코레이터
 * @param dto 내부 제네릭 타입 (예: LoginResponseDto)
 * @param description 응답 설명
 * @param includePagination Pagination 필드 포함 여부
 * @param isArray 배열 여부 (기본값: false)
 */
export function ApiSuccessResponse(
  dto: any,
  description: string,
  includePagination = false,
) {
  return applyDecorators(
    ApiExtraModels(dto),
    ApiExtraModels(SuccessResponseDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              result: includePagination
                ? {
                    type: "array",
                    items: { $ref: getSchemaPath(dto) },
                  }
                : { $ref: getSchemaPath(dto) },
              ...(includePagination && {
                pagination: { $ref: getSchemaPath("PaginationDto") },
              }),
            },
          },
        ],
      },
    })
  );
}
