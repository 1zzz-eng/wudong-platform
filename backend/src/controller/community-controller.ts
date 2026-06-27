import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { TravelNote, NoteComment, Topic, FollowRelation, LikeRecord, ReportRecord } from "../entity/community";
import { success, fail, paginated } from "../config/types";
import { Like } from "typeorm";

const router = Router();

// ========== 游记管理 ==========
router.get("/notes/list", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    const { page = 1, pageSize = 20, keyword, topic, sort, status, user_id } = req.query;
    const where: any = { is_deleted: false };
    if (status) where.status = status;
    else where.status = "published";
    if (keyword) where.title = Like(`%${keyword}%`);
    if (topic) where.topic_tags = Like(`%${topic}%`);
    if (user_id) where.user_id = Number(user_id);
    const [list, total] = await repo.findAndCount({
      where,
      order: sort === "latest" ? { created_at: "DESC" } : sort === "hot" ? { like_count: "DESC" } : { created_at: "DESC" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize)
    });
    res.json(success(paginated(list, total, Number(page), Number(pageSize))));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.get("/notes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    const note = await repo.findOne({ where: { id: Number(req.params.id), is_deleted: false } });
    if (!note) return res.status(404).json(fail("游记不存在", 404));
    // 增加浏览量
    await repo.update(Number(req.params.id), { view_count: (note.view_count || 0) + 1 });
    const comments = await AppDataSource.getRepository(NoteComment).find({ where: { note_id: note.id, is_deleted: false }, order: { created_at: "DESC" } });
    res.json(success({ ...note, view_count: note.view_count + 1, comments }));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/notes", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(TravelNote);
    // 检查每日发布上限
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await repo.count({ where: { user_id: userId, created_at: today as any } });
    if (todayCount >= 10) return res.status(400).json(fail("每日最多发布10篇游记"));

    const note = repo.create({ ...req.body, user_id: userId, status: "pending_review" });
    await repo.save(note);
    res.json(success(note, "游记发布成功，等待审核"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.put("/notes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    await repo.update(Number(req.params.id), req.body);
    res.json(success(null, "游记更新成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/notes/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(TravelNote);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "游记已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 评论管理 ==========
router.post("/comments", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    if (req.body.content && req.body.content.length > 500) return res.status(400).json(fail("评论最多500字"));
    const repo = AppDataSource.getRepository(NoteComment);
    const comment = repo.create({ ...req.body, user_id: userId });
    await repo.save(comment);
    // 更新游记评论数
    await AppDataSource.getRepository(TravelNote).increment({ id: req.body.note_id }, "comment_count", 1);
    res.json(success(comment, "评论成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.delete("/comments/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(NoteComment);
    await repo.update(Number(req.params.id), { is_deleted: true });
    res.json(success(null, "评论已删除"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 话题管理 ==========
router.get("/topics", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Topic);
    const list = await repo.find({ where: { is_deleted: false }, order: { note_count: "DESC" } });
    res.json(success(list));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

router.post("/topics", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Topic);
    const topic = repo.create(req.body);
    await repo.save(topic);
    res.json(success(topic, "话题创建成功"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 点赞 ==========
router.post("/likes", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(LikeRecord);
    const existing = await repo.findOne({ where: { user_id: userId, target_type: req.body.target_type, target_id: req.body.target_id } });
    if (existing) {
      await repo.remove(existing);
      if (req.body.target_type === "note") await AppDataSource.getRepository(TravelNote).decrement({ id: req.body.target_id }, "like_count", 1);
      res.json(success({ liked: false }, "取消点赞"));
    } else {
      const like = repo.create({ ...req.body, user_id: userId });
      await repo.save(like);
      if (req.body.target_type === "note") await AppDataSource.getRepository(TravelNote).increment({ id: req.body.target_id }, "like_count", 1);
      res.json(success({ liked: true }, "点赞成功"));
    }
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 关注 ==========
router.post("/follows", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(FollowRelation);
    const existing = await repo.findOne({ where: { user_id: userId, follow_user_id: req.body.follow_user_id } });
    if (existing) {
      await repo.remove(existing);
      res.json(success({ followed: false }, "取消关注"));
    } else {
      const follow = repo.create({ user_id: userId, follow_user_id: req.body.follow_user_id });
      await repo.save(follow);
      res.json(success({ followed: true }, "关注成功"));
    }
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

// ========== 举报 ==========
router.post("/reports", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json(fail("请先登录", 401));
    const repo = AppDataSource.getRepository(ReportRecord);
    const report = repo.create({ ...req.body, reporter_id: userId, status: "pending" });
    await repo.save(report);
    res.json(success(report, "举报已提交"));
  } catch (e: any) { res.status(500).json(fail(e.message, 500)); }
});

export { router as communityRouter };
