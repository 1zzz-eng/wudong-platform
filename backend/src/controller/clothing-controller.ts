import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ProductCategory } from "../entity/product-category";
import { Product } from "../entity/product";
import { ProductSku } from "../entity/product-sku";
import { ProductImage } from "../entity/product-image";
import { Review } from "../entity/common";
import { success, fail, paginated } from "../config/types";
import { Like } from "typeorm";

const router = Router();

// ========== 商品分类 ==========
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductCategory);
    const list = await repo.find({ where: { status: "active", is_deleted: false }, order: { sort_order: "ASC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/categories", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductCategory);
    const cat = repo.create(req.body);
    await repo.save(cat);
    res.json(success(cat, "分类创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/categories/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductCategory);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "分类更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/categories/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductCategory);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "分类已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 商品管理 ==========
router.get("/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    const { page = 1, pageSize = 20, category_id, keyword, min_price, max_price, sort } = req.query;
    const where: any = { status: "active", is_deleted: false };
    if (category_id) where.category_id = Number(category_id);
    if (keyword) where.title = Like(`%${keyword}%`);
    const [list, total] = await repo.findAndCount({
      where,
      order: sort === "sales" ? { sales_count: "DESC" } : sort === "price_asc" ? { price: "ASC" } : sort === "price_desc" ? { price: "DESC" } : { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!product) return res.status(404).json(fail("商品不存在", 404));
    const skus = await AppDataSource.getRepository(ProductSku).find({ where: { product_id: product.id, is_deleted: false } });
    const images = await AppDataSource.getRepository(ProductImage).find({ where: { product_id: product.id }, order: { sort_order: "ASC" } });
    const reviews = await AppDataSource.getRepository(Review).find({ where: { review_type: "product", item_id: product.id, is_deleted: false }, order: { created_at: "DESC" }, take: 10 });
    res.json(success({ ...product, skus, images, reviews }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    const product = repo.create(req.body);
    await repo.save(product);
    res.json(success(product, "商品创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "商品更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "商品已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// 商品SKU管理
router.get("/skus/:productId", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductSku);
    const list = await repo.find({ where: { product_id: Number(req.params.productId), is_deleted: false } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/skus", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductSku);
    const sku = repo.create(req.body);
    await repo.save(sku);
    res.json(success(sku, "SKU创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/skus/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ProductSku);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "SKU更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as clothingRouter };
