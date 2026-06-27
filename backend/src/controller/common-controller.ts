import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Banner, PlatformNotice } from "../entity/admin";
import { success, fail } from "../config/types";

const router = Router();

// API文档概览
router.get("/docs", (req: Request, res: Response) => {
  res.json(success({
    name: "乌东文旅API服务",
    version: "1.0.0",
    modules: {
      common: "公共接口 - /api/common",
      user: "用户接口 - /api/user",
      clothing: "衣-非遗商品 - /api/clothing",
      food: "食-餐饮美食 - /api/food",
      hotel: "住-住宿预订 - /api/hotel",
      travel: "行-线路订票 - /api/travel",
      community: "社区-照片分享 - /api/community",
      admin: "平台管理 - /api/admin",
      order: "统一订单 - /api/order",
      cart: "统一购物车 - /api/cart"
    },
    standardResponse: { code: 200, message: "success", data: {} },
    pagination: { page: 1, pageSize: 20, total: 100 },
    auth: "Bearer Token 放在 Authorization 请求头"
  }));
});

// 首页轮播图
router.get("/banners", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Banner);
    const list = await repo.find({ where: { status: "active", is_deleted: false }, order: { sort_order: "ASC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 平台公告
router.get("/notices", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PlatformNotice);
    const list = await repo.find({ where: { status: "published", is_deleted: false }, order: { created_at: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 首页数据聚合
router.get("/home", async (req: Request, res: Response) => {
  try {
    const banners = await AppDataSource.getRepository(Banner).find({ where: { status: "active", is_deleted: false }, order: { sort_order: "ASC" }, take: 5 });
    const notices = await AppDataSource.getRepository(PlatformNotice).find({ where: { status: "published", is_deleted: false }, order: { created_at: "DESC" }, take: 3 });
    res.json(success({ banners, notices }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as commonRouter };
