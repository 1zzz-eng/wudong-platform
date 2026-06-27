import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import { errorHandler } from "./middleware/error-handler";
import { authMiddleware } from "./middleware/auth";

// 导入各模块路由
import { userRouter } from "./controller/user-controller";
import { clothingRouter } from "./controller/clothing-controller";
import { foodRouter } from "./controller/food-controller";
import { hotelRouter } from "./controller/hotel-controller";
import { travelRouter } from "./controller/travel-controller";
import { communityRouter } from "./controller/community-controller";
import { adminRouter } from "./controller/admin-controller";
import { commonRouter } from "./controller/common-controller";
import { orderRouter } from "./controller/order-controller";
import { cartRouter } from "./controller/cart-controller";

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 静态文件（上传的图片等）
app.use("/uploads", express.static("uploads"));

// 公开路由（无需鉴权）
app.use("/api/common", commonRouter);
app.use("/api/user", userRouter);

// 需要鉴权的路由
app.use("/api/clothing", clothingRouter);
app.use("/api/food", foodRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/travel", travelRouter);
app.use("/api/community", communityRouter);
app.use("/api/admin", adminRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

// 错误处理
app.use(errorHandler);

// 启动服务
AppDataSource.initialize()
  .then(() => {
    console.log("✅ 数据库连接成功");
    app.listen(PORT, () => {
      console.log(`🚀 乌东文旅API服务已启动: http://localhost:${PORT}`);
      console.log(`📋 API文档地址: http://localhost:${PORT}/api/common/docs`);
    });
  })
  .catch((error) => {
    console.error("❌ 数据库连接失败:", error);
    process.exit(1);
  });

export default app;
