import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { AdminUser, Role, Merchant, MerchantApply, PlatformNotice, Banner, SystemMessage, OperationLog } from "../entity/admin";
import { User } from "../entity/user";
import { Order } from "../entity/common";
import { TravelNote, ReportRecord } from "../entity/community";
import { success, fail, paginated } from "../config/types";
import { JWT_SECRET } from "../middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Like } from "typeorm";

const router = Router();

// ========== 管理员登录 ==========
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const repo = AppDataSource.getRepository(AdminUser);
    const admin = await repo.findOne({ where: { username }, select: ["id", "username", "password", "real_name", "role_id", "status"] });
    if (!admin) return res.status(400).json(fail("管理员不存在"));
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json(fail("密码错误"));
    if (admin.status !== "active") return res.status(400).json(fail("账号已被禁用"));
    const token = jwt.sign({ userId: admin.id, username: admin.username, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
    await repo.update(admin.id, { last_login: new Date() });
    res.json(success({ token, admin: { id: admin.id, username: admin.username, real_name: admin.real_name } }, "登录成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 商家登录
router.post("/merchant-login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const repo = AppDataSource.getRepository(Merchant);
    const merchant = await repo.findOne({ where: { username } });
    if (!merchant) return res.status(400).json(fail("商家不存在"));
    const token = jwt.sign({ userId: merchant.id, username: merchant.username, role: "merchant", module: merchant.module }, JWT_SECRET, { expiresIn: "8h" });
    res.json(success({ token, merchant }, "登录成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== RBAC 权限管理 ==========
router.get("/roles", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const list = await repo.find({ where: { is_deleted: false } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/roles", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const role = repo.create(req.body);
    await repo.save(role);
    res.json(success(role, "角色创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 用户管理 ==========
router.get("/users/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(User);
    const { page = 1, pageSize = 20, keyword, status } = req.query;
    const where: any = { is_deleted: false };
    if (keyword) where.phone = Like(`%${keyword}%`);
    if (status) where.status = status;
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/users/:id/status", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(User);
    await repo.update(Number(req.params.id), { status: req.body.status });
    res.json(success(null, `用户已${req.body.status === 'active' ? '解封' : '封禁'}`));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 商家入驻审核 ==========
router.get("/merchant-applies/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(MerchantApply);
    const { page = 1, pageSize = 20, status } = req.query;
    const where: any = { is_deleted: false };
    if (status) where.status = status;
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/merchant-applies/:id/review", async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.userId;
    const repo = AppDataSource.getRepository(MerchantApply);
    const apply = await repo.findOne({ where: { id: Number(req.params.id) } });
    if (!apply) return res.status(404).json(fail("申请不存在", 404));
    await repo.update(Number(req.params.id), {
      status: req.body.status, reviewer_id: adminId,
      review_reason: req.body.reason, reviewed_at: new Date()
    });
    // 如果通过，创建商家账号
    if (req.body.status === "approved") {
      const merchantRepo = AppDataSource.getRepository(Merchant);
      const merchant = merchantRepo.create({
        user_id: apply.user_id, username: `shop_${apply.user_id}`,
        module: apply.module, shop_name: apply.shop_name,
        contact_name: apply.shop_name, contact_phone: "",
        status: "active"
      });
      await merchantRepo.save(merchant);
    }
    res.json(success(null, `审核${req.body.status === 'approved' ? '通过' : '驳回'}`));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 全局订单 ==========
router.get("/orders/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    const { page = 1, pageSize = 20, order_type, status, keyword } = req.query;
    const where: any = { is_deleted: false };
    if (order_type) where.order_type = order_type;
    if (status) where.status = status;
    if (keyword) where.order_no = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 内容审核 ==========
router.get("/notes/review-list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    const { page = 1, pageSize = 20, status } = req.query;
    const where: any = { is_deleted: false };
    if (status) where.status = status; else where.status = "pending_review";
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "ASC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/notes/:id/review", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    await repo.update(Number(req.params.id), {
      status: req.body.status,
      review_reason: req.body.reason
    });
    res.json(success(null, `审核${req.body.status === 'published' ? '通过' : '驳回'}`));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 公告管理 ==========
router.get("/notices/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PlatformNotice);
    const list = await repo.find({ where: { is_deleted: false }, order: { created_at: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/notices", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PlatformNotice);
    const notice = repo.create(req.body);
    await repo.save(notice);
    res.json(success(notice, "公告创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/notices/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PlatformNotice);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "公告已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== Banner 管理 ==========
router.get("/banners/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Banner);
    const list = await repo.find({ where: { is_deleted: false }, order: { sort_order: "ASC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/banners", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Banner);
    const banner = repo.create(req.body);
    await repo.save(banner);
    res.json(success(banner, "Banner创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/banners/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Banner);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "Banner更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/banners/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Banner);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "Banner已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 举报处理 ==========
router.get("/reports/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ReportRecord);
    const { page = 1, pageSize = 20, status } = req.query;
    const where: any = { is_deleted: false };
    if (status) where.status = status;
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/reports/:id/handle", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ReportRecord);
    await repo.update(Number(req.params.id), { status: "handled", handle_result: req.body.result });
    res.json(success(null, "举报已处理"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 数据看板 ==========
router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const userCount = await AppDataSource.getRepository(User).count({ where: { is_deleted: false } });
    const orderCount = await AppDataSource.getRepository(Order).count({ where: { is_deleted: false } });
    const noteCount = await AppDataSource.getRepository(TravelNote).count({ where: { is_deleted: false } });
    const merchantCount = await AppDataSource.getRepository(Merchant).count({ where: { is_deleted: false } });
    const pendingApplies = await AppDataSource.getRepository(MerchantApply).count({ where: { status: "pending", is_deleted: false } });
    const pendingNotes = await AppDataSource.getRepository(TravelNote).count({ where: { status: "pending_review", is_deleted: false } });

    // 订单金额统计
    const orders = await AppDataSource.getRepository(Order).find({ where: { is_deleted: false } });
    const totalGMV = orders.reduce((sum, o) => sum + Number(o.paid_amount || 0), 0);
    const paidOrders = orders.filter(o => o.status === "paid" || o.status === "completed");

    res.json(success({
      user_count: userCount, order_count: orderCount, note_count: noteCount,
      merchant_count: merchantCount, pending_applies: pendingApplies, pending_notes: pendingNotes,
      total_gmv: totalGMV.toFixed(2), paid_order_count: paidOrders.length
    }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as adminRouter };
