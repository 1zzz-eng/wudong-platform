import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ScenicSpot, TicketType, TourRoute, RouteItinerary, ETicket } from "../entity/travel";
import { Review } from "../entity/common";
import { success, fail, paginated } from "../config/types";
import { Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ========== 景区管理 ==========
router.get("/scenic-spots/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ScenicSpot);
    const list = await repo.find({ where: { status: "active", is_deleted: false } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/scenic-spots/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ScenicSpot);
    const spot = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!spot) return res.status(404).json(fail("景区不存在", 404));
    const tickets = await AppDataSource.getRepository(TicketType).find({ where: { scenic_spot_id: spot.id, is_deleted: false } });
    res.json(success({ ...spot, tickets }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/scenic-spots", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ScenicSpot);
    const spot = repo.create(req.body);
    await repo.save(spot);
    res.json(success(spot, "景区创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/scenic-spots/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ScenicSpot);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "景区更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/scenic-spots/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ScenicSpot);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "景区已下架"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 票种管理 ==========
router.get("/ticket-types/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TicketType);
    const { scenic_spot_id } = req.query;
    const where: any = { is_deleted: false };
    if (scenic_spot_id) where.scenic_spot_id = Number(scenic_spot_id);
    const list = await repo.find({ where });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/ticket-types", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TicketType);
    const ticket = repo.create(req.body);
    await repo.save(ticket);
    res.json(success(ticket, "票种创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/ticket-types/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TicketType);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "票种更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/ticket-types/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TicketType);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "票种已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 路线套餐 ==========
router.get("/routes/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TourRoute);
    const { page = 1, pageSize = 20, keyword } = req.query;
    const where: any = { status: "active", is_deleted: false };
    if (keyword) where.title = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/routes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TourRoute);
    const route = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!route) return res.status(404).json(fail("路线不存在", 404));
    const itineraries = await AppDataSource.getRepository(RouteItinerary).find({ where: { route_id: route.id, is_deleted: false }, order: { day_number: "ASC" } });
    const reviews = await AppDataSource.getRepository(Review).find({ where: { review_type: "route", item_id: route.id, is_deleted: false }, order: { created_at: "DESC" }, take: 10 });
    res.json(success({ ...route, itineraries, reviews }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/routes", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TourRoute);
    const route = repo.create(req.body);
    await repo.save(route);
    res.json(success(route, "路线创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/routes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TourRoute);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "路线更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/routes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TourRoute);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "路线已下架"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 电子票核销 ==========
router.get("/e-tickets/:code", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ETicket);
    const ticket = await repo.findOne({ where: { ticket_code: req.params.code, is_deleted: false } });
    if (!ticket) return res.status(404).json(fail("电子票不存在", 404));
    res.json(success(ticket));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/e-tickets/:id/verify", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ETicket);
    const ticket = await repo.findOne({ where: { id: Number(req.params.id) } });
    if (!ticket) return res.status(404).json(fail("电子票不存在", 404));
    if (ticket.status === "used") return res.status(400).json(fail("电子票已核销"));
    await repo.update(Number(req.params.id), { status: "used" });
    res.json(success(null, "核销成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as travelRouter };
