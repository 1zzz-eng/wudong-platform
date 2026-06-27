import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Hotel, RoomType, RoomCalendar } from "../entity/hotel";
import { Review } from "../entity/common";
import { success, fail, paginated } from "../config/types";
import { Like, Between } from "typeorm";

const router = Router();

// ========== 民宿管理 ==========
router.get("/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Hotel);
    const { page = 1, pageSize = 20, keyword, check_in, check_out, min_price, max_price } = req.query;
    const where: any = { status: "active", is_deleted: false };
    if (keyword) where.name = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where, order: { rating: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Hotel);
    const hotel = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!hotel) return res.status(404).json(fail("民宿不存在", 404));
    const roomTypes = await AppDataSource.getRepository(RoomType).find({ where: { hotel_id: hotel.id, is_deleted: false } });
    const reviews = await AppDataSource.getRepository(Review).find({ where: { review_type: "hotel", item_id: hotel.id, is_deleted: false }, order: { created_at: "DESC" }, take: 10 });
    res.json(success({ ...hotel, roomTypes, reviews }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Hotel);
    const hotel = repo.create(req.body);
    await repo.save(hotel);
    res.json(success(hotel, "民宿创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Hotel);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "民宿更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Hotel);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "民宿已下架"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 房型管理 ==========
router.get("/room-types/:hotelId", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomType);
    const list = await repo.find({ where: { hotel_id: Number(req.params.hotelId), is_deleted: false } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/room-types", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomType);
    const rt = repo.create(req.body);
    await repo.save(rt);
    res.json(success(rt, "房型创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/room-types/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomType);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "房型更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 房态日历 ==========
router.get("/calendar/:roomTypeId", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomCalendar);
    const { start_date, end_date } = req.query;
    const where: any = { room_type_id: Number(req.params.roomTypeId), is_deleted: false };
    if (start_date && end_date) {
      where.date = Between(start_date as string, end_date as string);
    }
    const list = await repo.find({ where, order: { date: "ASC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/calendar", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomCalendar);
    const cal = repo.create(req.body);
    await repo.save(cal);
    res.json(success(cal, "房态设置成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/calendar/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(RoomCalendar);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "房态更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as hotelRouter };
