import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entity/user";
import { Favorite, UserAddress } from "../entity/common";
import { MerchantApply } from "../entity/admin";
import { success, fail, paginated } from "../config/types";
import { JWT_SECRET } from "../middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// 用户注册
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { phone, password, nickname } = req.body;
    if (!phone || !password) return res.status(400).json(fail("手机号和密码不能为空"));

    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOne({ where: { phone } });
    if (existing) return res.status(400).json(fail("该手机号已注册"));

    const hashedPwd = await bcrypt.hash(password, 10);
    const user = repo.create({ phone, password: hashedPwd, nickname: nickname || `用户${phone.slice(-4)}` });
    await repo.save(user);

    const token = jwt.sign({ userId: user.id, username: user.phone, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
    res.json(success({ token, user: { id: user.id, phone: user.phone, nickname: user.nickname } }, "注册成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 用户登录
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json(fail("手机号和密码不能为空"));

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { phone }, select: ["id", "phone", "password", "nickname", "avatar", "status"] });
    if (!user) return res.status(400).json(fail("用户不存在"));

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json(fail("密码错误"));

    if (user.status !== "active") return res.status(400).json(fail("账号已被禁用"));

    const token = jwt.sign({ userId: user.id, username: user.phone, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
    res.json(success({ token, user: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar } }, "登录成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 获取用户信息
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json(fail("用户不存在", 404));
    res.json(success(user));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 更新用户信息
router.put("/profile", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(User);
    await repo.update(userId, req.body);
    const user = await repo.findOne({ where: { id: userId } });
    res.json(success(user, "更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 商家入驻申请
router.post("/merchant-apply", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(MerchantApply);
    const apply = repo.create({ ...req.body, user_id: userId, status: "pending" });
    await repo.save(apply);
    res.json(success(apply, "申请已提交，请等待审核"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 我的收藏
router.get("/favorites", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Favorite);
    const list = await repo.find({ where: { user_id: userId, is_deleted: false }, order: { created_at: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 添加收藏
router.post("/favorites", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Favorite);
    const existing = await repo.findOne({ where: { user_id: userId, favorite_type: req.body.favorite_type, item_id: req.body.item_id } });
    if (existing) return res.json(success(existing, "已收藏"));
    const fav = repo.create({ ...req.body, user_id: userId });
    await repo.save(fav);
    res.json(success(fav, "收藏成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 取消收藏
router.delete("/favorites/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Favorite);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "已取消收藏"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 收货地址管理
router.get("/addresses", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(UserAddress);
    const list = await repo.find({ where: { user_id: userId, is_deleted: false }, order: { is_default: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/addresses", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(UserAddress);
    if (req.body.is_default) {
      await repo.update({ user_id: userId }, { is_default: false });
    }
    const addr = repo.create({ ...req.body, user_id: userId });
    await repo.save(addr);
    res.json(success(addr, "地址添加成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/addresses/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(UserAddress);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "地址已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as userRouter };
