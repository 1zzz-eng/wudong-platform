import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload, fail } from "../config/types";

const JWT_SECRET = process.env.JWT_SECRET || "wudong-platform-jwt-secret-key-2026";

// 验证JWT token
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // 公开路由跳过鉴权
  const publicPaths = ["/api/common", "/api/user/login", "/api/user/register", "/api/user/wx-login"];
  if (publicPaths.some(p => req.path.startsWith(p)) && req.method === "GET") {
    return next();
  }
  if (req.path === "/api/user/login" || req.path === "/api/user/register" || req.path === "/api/user/wx-login" || req.path.startsWith("/api/common")) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // 对于列表和详情页，允许未登录访问
    if (req.method === "GET" && (req.path.includes("/list") || req.path.match(/^\/api\/\w+\/\d+$/))) {
      return next();
    }
    return res.status(401).json(fail("未登录，请先登录", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(fail("token已过期，请重新登录", 401));
  }
}

// 管理员鉴权
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(fail("请先登录管理后台", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin" && decoded.role !== "merchant") {
      return res.status(403).json(fail("无权限访问", 403));
    }
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(fail("token已过期，请重新登录", 401));
  }
}

export { JWT_SECRET };
