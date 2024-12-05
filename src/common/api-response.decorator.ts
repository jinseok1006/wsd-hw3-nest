import { applyDecorators } from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { ErrorResponseDto } from "./response.dto";

export function ApiCommonResponses() {
  return applyDecorators(
    ApiConflictResponse({
      type: ErrorResponseDto,
      description: "Conflict",
      example: {
        message: ["error message"],
        error: "Conflict",
        statusCode: 409,
      },
    }),
    ApiBadRequestResponse({
      type: ErrorResponseDto,
      description: "Bad Request",
      example: {
        message: ["error message"],
        error: "Bad Request",
        statusCode: 400,
      },
    }),
    ApiNotFoundResponse({
      type: ErrorResponseDto,
      description: "Not Found",
      example: {
        message: ["error message"],
        error: "Not Found",
        statusCode: 404,
      },
    })
  );
}
