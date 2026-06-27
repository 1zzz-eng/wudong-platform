import { Request, Response, NextFunction } from "express";
import { fail } from "../config/types";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("❌ 服务器错误:", err.message);
  console.error(err.stack);
  res.status(500).json(fail("服务器内部错误: " + err.message, 500));
}
