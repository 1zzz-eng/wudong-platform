# 乌东文旅"衣食住行"综合服务平台

> **苗族文化 × 数字文旅** — 为贵州乌东村打造的一站式文旅数字化服务平台

## 项目概述

乌东文旅平台以"衣食住行"为业务主线，覆盖游客从内容种草、社区分享、商品/餐饮/住宿/门票预订到订单管理、平台运营的全链路。包含**微信小程序端**、**PC网页端**、**管理后台**三端。

### 六大业务模块

| 模块 | 名称 | 业务定位 |
|------|------|---------|
| 衣 | 非遗商品模块 | 苗族银饰/蜡染/刺绣/服饰在线展示与购买 |
| 食 | 餐饮美食模块 | 苗家特色餐厅预订 + 农产品特产电商 |
| 住 | 住宿预订模块 | 苗寨特色民宿/客栈搜索与在线预订 |
| 行 | 线路订票模块 | 景区门票 + 苗寨游路线套餐 + 电子票核销 |
| 社区 | 照片分享模块 | 游记/照片/短视频UGC内容社区 |
| 管理 | 平台管理后台 | 用户/商家/订单/内容/数据全局管理 |

## 技术架构

```
┌──────────────────────────────────────────────┐
│   客户端：小程序端   PC 网页端   管理后台     │
└──────────────────────┬───────────────────────┘
                       │ HTTPS / JSON
┌──────────────────────▼───────────────────────┐
│          API 网关层（Express.js）             │
│         统一鉴权 / 限流 / 统一响应            │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│   模块一  模块二  模块三  模块四  模块五  模块六 │
│   衣-商品  食-餐饮  住-住宿  行-票务  社区    管理│
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│       SQLite (开发) / MySQL (生产)            │
└───────────────────────────────────────────────┘
```

## 项目结构

```
wudong-platform/
├── backend/              # 后端API服务 (Express + TypeORM)
│   ├── src/
│   │   ├── controller/   # 路由控制器 (8个模块)
│   │   ├── entity/       # 数据实体 (30+实体)
│   │   ├── middleware/    # 中间件 (鉴权/错误处理/上传)
│   │   ├── config/       # 配置 (数据库/类型定义)
│   │   └── scripts/      # 脚本 (种子数据)
│   ├── sql/              # 数据库DDL脚本
│   └── data/             # SQLite数据库文件
├── web/                  # PC Web前端 (React + Vite)
│   └── src/
│       ├── pages/        # 页面 (11个页面模块)
│       ├── components/   # 公共组件
│       └── api/          # API封装
├── miniprogram/          # 微信小程序 (原生)
│   ├── pages/            # 页面 (11个页面)
│   ├── utils/            # 工具函数
│   └── components/       # 公共组件
├── admin/                # 管理后台 (React + Vite + Ant Design)
│   └── src/
│       ├── pages/        # 页面 (15个管理页面)
│       ├── components/   # 公共组件
│       └── api/          # API封装
└── docs/                 # 文档
```

## 快速启动

### 1. 后端服务 (端口 3000)

```bash
cd backend
npm install
npm run db:seed     # 初始化种子数据
npm run dev         # 启动开发服务器
```

- 管理员账号: `admin` / `123456`
- 测试用户: `13800138001` / `123456`

### 2. PC Web端 (端口 5173)

```bash
cd web
npm install
npm run dev
```

浏览器访问: http://localhost:5173

### 3. 管理后台 (端口 5174)

```bash
cd admin
npm install
npm run dev
```

浏览器访问: http://localhost:5174

### 4. 微信小程序

1. 打开微信开发者工具
2. 导入项目 `miniprogram/` 目录
3. 在设置中开启"不校验合法域名"
4. 编译运行

## API接口规范

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 状态码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 分页参数

请求: `?page=1&pageSize=20`
响应: `{ "total": 100, "page": 1, "pageSize": 20, "list": [...] }`

### 鉴权方式

JWT Bearer Token: `Authorization: Bearer <token>`

## 接口列表

### 公共接口 `/api/common`
- `GET /docs` - API文档
- `GET /home` - 首页数据聚合
- `GET /banners` - 轮播图列表
- `GET /notices` - 公告列表

### 用户接口 `/api/user`
- `POST /register` - 注册
- `POST /login` - 登录
- `GET /profile` - 个人信息
- `PUT /profile` - 更新信息
- `POST /merchant-apply` - 商家入驻申请
- `GET/POST/DELETE /favorites` - 收藏管理
- `GET/POST/DELETE /addresses` - 地址管理

### 衣-非遗商品 `/api/clothing`
- `GET /list` - 商品列表(分页/筛选/搜索)
- `GET /:id` - 商品详情
- `POST/PUT/DELETE /` - 商品CRUD
- `GET/POST /categories` - 分类管理
- `GET/POST /skus` - SKU管理

### 食-餐饮美食 `/api/food`
- `GET /restaurants/list` - 餐厅列表
- `GET /restaurants/:id` - 餐厅详情
- `POST /reservations` - 餐位预订
- `GET /dishes/list` - 菜品列表
- `GET /farm-products/list` - 农产品列表

### 住-住宿预订 `/api/hotel`
- `GET /list` - 民宿列表
- `GET /:id` - 民宿详情
- `GET /room-types/:hotelId` - 房型列表
- `GET /calendar/:roomTypeId` - 房态日历

### 行-线路订票 `/api/travel`
- `GET /scenic-spots/list` - 景区列表
- `GET /ticket-types/list` - 票种列表
- `GET /routes/list` - 路线列表
- `GET /routes/:id` - 路线详情
- `PUT /e-tickets/:id/verify` - 电子票核销

### 社区-照片分享 `/api/community`
- `GET /notes/list` - 游记列表
- `GET /notes/:id` - 游记详情
- `POST /notes` - 发布游记
- `POST /comments` - 发表评论
- `POST /likes` - 点赞/取消点赞
- `POST /follows` - 关注/取消关注
- `POST /reports` - 举报

### 管理后台 `/api/admin`
- `POST /login` - 管理员登录
- `POST /merchant-login` - 商家登录
- `GET /dashboard` - 数据看板
- `GET /users/list` - 用户管理
- `GET/PUT /merchant-applies` - 商家审核
- `GET /orders/list` - 全局订单
- `GET/PUT /notes/review` - 游记审核
- `CRUD /notices` - 公告管理
- `CRUD /banners` - Banner管理

### 统一订单 `/api/order`
- `POST /create` - 创建订单
- `GET /list` - 订单列表
- `GET /:id` - 订单详情
- `PUT /:id/cancel` - 取消订单
- `PUT /:id/refund` - 申请退款
- `PUT /:id/confirm` - 确认收货
- `POST /reviews` - 评价

### 统一购物车 `/api/cart`
- `GET /list` - 购物车列表
- `POST /add` - 加入购物车
- `PUT /:id/quantity` - 更新数量
- `PUT /:id/check` - 切换选中
- `PUT /check-all` - 全选/取消
- `DELETE /:id` - 删除
- `DELETE /clear-checked` - 清空已选

## 设计规范

### 品牌色
- 主色: `#1F5FA8` (苗银蓝)
- 深色: `#0E3D75` (苗银深蓝)
- 辅色: `#E85D2F` (苗绣橙)
- 成功: `#52C41A`
- 警告: `#FAAD14`
- 错误: `#FF4D4F`

### 字体
- 标题: 阿里巴巴普惠体 Bold / 思源黑体 Bold
- 正文: 阿里巴巴普惠体 Regular / 思源黑体 Regular
- 数字: DIN Alternate Bold

### 间距
基于8px基准栅格: 4/8/12/16/24/32/48/64px

## 许可证

本项目为课程设计项目，仅用于学习目的。

---

**开发团队**: AI全栈开发  
**版本**: V1.0  
**日期**: 2026-06-26
