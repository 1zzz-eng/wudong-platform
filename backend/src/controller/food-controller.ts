import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Restaurant, Dish, MealPeriod, MealReservation, FarmProduct } from "../entity/restaurant";
import { Review } from "../entity/common";
import { success, fail, paginated } from "../config/types";
import { Like } from "typeorm";

const router = Router();

// ========== 餐厅管理 ==========
router.get("/restaurants/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Restaurant);
    const { page = 1, pageSize = 20, keyword } = req.query;
    const where: any = { status: "active", is_deleted: false };
    if (keyword) where.name = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where, order: { rating: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/restaurants/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Restaurant);
    const restaurant = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!restaurant) return res.status(404).json(fail("餐厅不存在", 404));
    const dishes = await AppDataSource.getRepository(Dish).find({ where: { restaurant_id: restaurant.id, is_deleted: false } });
    const periods = await AppDataSource.getRepository(MealPeriod).find({ where: { restaurant_id: restaurant.id, is_deleted: false } });
    const reviews = await AppDataSource.getRepository(Review).find({ where: { review_type: "restaurant", item_id: restaurant.id, is_deleted: false }, order: { created_at: "DESC" }, take: 10 });
    res.json(success({ ...restaurant, dishes, periods, reviews }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/restaurants", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Restaurant);
    const r = repo.create(req.body);
    await repo.save(r);
    res.json(success(r, "餐厅创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/restaurants/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Restaurant);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "餐厅更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/restaurants/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Restaurant);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "餐厅已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 餐位预订 ==========
router.post("/reservations", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(MealReservation);
    const reservation = repo.create({ ...req.body, user_id: userId, status: "pending" });
    await repo.save(reservation);
    res.json(success(reservation, "预订成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/reservations/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(MealReservation);
    const { page = 1, pageSize = 20 } = req.query;
    const [list, total] = await repo.findAndCount({
      where: { is_deleted: false }, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/reservations/:id/status", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(MealReservation);
    await repo.update(Number(req.params.id), { status: req.body.status });
    res.json(success(null, "状态更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 菜品管理 ==========
router.get("/dishes/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Dish);
    const { restaurant_id } = req.query;
    const where: any = { is_deleted: false };
    if (restaurant_id) where.restaurant_id = Number(restaurant_id);
    const list = await repo.find({ where, order: { is_signature: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/dishes", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Dish);
    const dish = repo.create(req.body);
    await repo.save(dish);
    res.json(success(dish, "菜品创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/dishes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Dish);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "菜品已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 农产品 ==========
router.get("/farm-products/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(FarmProduct);
    const { page = 1, pageSize = 20, keyword } = req.query;
    const where: any = { status: "active", is_deleted: false };
    if (keyword) where.name = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where, order: { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/farm-products/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(FarmProduct);
    const product = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!product) return res.status(404).json(fail("商品不存在", 404));
    res.json(success(product));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/farm-products", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(FarmProduct);
    const p = repo.create(req.body);
    await repo.save(p);
    res.json(success(p, "农产品创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/farm-products/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(FarmProduct);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "已下架"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as foodRouter };
