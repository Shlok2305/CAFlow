import type { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  status?: number;
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode === 500
        ? "Internal server error"
        : err.message || "An unexpected error occurred",
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
