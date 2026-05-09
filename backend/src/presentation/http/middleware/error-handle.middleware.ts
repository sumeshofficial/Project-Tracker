import type { ErrorRequestHandler } from "express";
import { ZodError, z } from "zod";
import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";
import { ErrorMessages } from "@shared/errors/error-messages.js";

export const errorHandlerMiddleware = (): ErrorRequestHandler => {
  return (error, _request, response, _next) => {
    const statusCode = error instanceof AppException ? error.statusCode : 500;
    const code =
      error instanceof AppException
        ? error.code
        : ErrorCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof AppException
        ? error.message
        : ErrorMessages.INTERNAL_SERVER_ERROR;

    console.error(error);

    if (error instanceof ZodError) {
      return response.status(400).json({
        success: false,
        code: ErrorCodes.VALIDATION_ERROR,
        message: ErrorMessages.VALIDATION_ERROR,
        details: z.treeifyError(error),
      });
    }

    return response.status(statusCode).json({
      success: false,
      code,
      message,
    });
  };
};
