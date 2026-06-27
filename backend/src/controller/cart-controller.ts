import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Cart } from "../entity/common";
import { success, fail } from "../config/types";

const router = Router();

// 获取购物车
router.get("/list", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Cart);
    const list = await repo.find({ where: { user_id: userId, is_deleted: false }, order: { created_at: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 加入购物车
router.post("/add", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Cart);
    // 检查是否已存在
    const existing = await repo.findOne({
      where: { user_id: userId, item_type: req.body.item_type, item_id: req.body.item_id, sku_id: req.body.sku_id || null, is_deleted: false }
    });
    if (existing) {
      await repo.update(existing.id, { quantity: existing.quantity + (req.body.quantity || 1) });
      res.json(success(null, "购物车数量已更新"));
    } else {
      const cart = repo.create({ ...req.body, user_id: userId });
      await repo.save(cart);
      res.json(success(cart, "已加入购物车"));
    }
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 更新数量
router.put("/:id/quantity", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Cart);
    await repo.update(Number(req.params.id), { quantity: req.body.quantity });
    res.json(success(null, "数量已更新"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 切换选中状态
router.put("/:id/check", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Cart);
    const item = await repo.findOne({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json(fail("购物车项不存在", 404));
    await repo.update(Number(req.params.id), { is_checked: !item.is_checked });
    res.json(success(null, "状态已切换"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 全选/取消全选
router.put("/check-all", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Cart);
    await repo.update({ user_id: userId, is_deleted: false }, { is_checked: req.body.is_checked });
    res.json(success(null, "操作成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 删除购物车项
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Cart);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "已从购物车移除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 清空已勾选
router.delete("/clear-checked", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Cart);
    await repo.update({ user_id: userId, is_checked: true, is_deleted: false }, { is_deleted: true });
    res.json(success(null, "已清空选中项"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as cartRouter };
