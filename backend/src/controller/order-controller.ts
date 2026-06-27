import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Order } from "../entity/common";
import { ETicket } from "../entity/travel";
import { Review } from "../entity/common";
import { success, fail, paginated } from "../config/types";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// 生成订单号
function generateOrderNo(): string {
  return "WD" + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// 创建订单
router.post("/create", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Order);
    const orderNo = generateOrderNo();
    const order: any = repo.create({
      ...req.body, user_id: userId, order_no: orderNo,
      status: "pending_pay", paid_amount: req.body.total_amount
    });
    const savedOrder = await repo.save(order);

    // 如果是门票/路线订单，生成电子票
    if (req.body.order_type === "ticket" || req.body.order_type === "route") {
      const ticketRepo = AppDataSource.getRepository(ETicket);
      const ticket: any = ticketRepo.create({
        order_id: savedOrder.id, item_id: req.body.item_id,
        item_type: req.body.order_type, ticket_code: uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase(),
        valid_date: req.body.extra_info?.valid_date || new Date().toISOString().slice(0, 10), status: "unused"
      });
      await ticketRepo.save(ticket);
    }

    res.json(success({ order_no: orderNo, order_id: savedOrder.id }, "订单创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 订单列表
router.get("/list", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Order);
    const { page = 1, pageSize = 20, status, order_type } = req.query;
    const where: any = { user_id: userId, is_deleted: false };
    if (status) where.status = status;
    if (order_type) where.order_type = order_type;
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 订单详情
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!order) return res.status(404).json(fail("订单不存在", 404));
    // 查询电子票
    const tickets = await AppDataSource.getRepository(ETicket).find({ where: { order_id: order.id, is_deleted: false } });
    res.json(success({ ...order, tickets }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 取消订单
router.put("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOne({ where: { id: Number(req.params.id) } });
    if (!order) return res.status(404).json(fail("订单不存在", 404));
    if (order.status !== "pending_pay" && order.status !== "paid") {
      return res.status(400).json(fail("当前订单状态不可取消"));
    }
    await repo.update(Number(req.params.id), { status: "cancelled" });
    res.json(success(null, "订单已取消"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 申请退款
router.put("/:id/refund", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    await repo.update(Number(req.params.id), { status: "refunded" });
    res.json(success(null, "退款申请已提交"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 确认收货
router.put("/:id/confirm", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    await repo.update(Number(req.params.id), { status: "completed", completed_at: new Date() });
    res.json(success(null, "已确认收货"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 评价 ==========
router.post("/reviews", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(Review);
    const review = repo.create({ ...req.body, user_id: userId });
    await repo.save(review);
    res.json(success(review, "评价成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 追评
router.put("/reviews/:id/follow-up", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Review);
    await repo.update(Number(req.params.id), { follow_up: req.body.follow_up });
    res.json(success(null, "追评成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as orderRouter };
