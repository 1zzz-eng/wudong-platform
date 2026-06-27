-- ===================================================
-- 乌东文旅"衣食住行"综合服务平台 - 数据库初始化脚本
-- 版本: V1.0 | 日期: 2026-06-26
-- 数据库: MySQL 8.0+
-- ===================================================

CREATE DATABASE IF NOT EXISTS wudong_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_platform;

-- ===================================================
-- 公共基础表
-- ===================================================

-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
  password VARCHAR(100) NOT NULL COMMENT '密码(bcrypt加密)',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar VARCHAR(255) COMMENT '头像URL',
  gender VARCHAR(10) COMMENT '性别',
  region VARCHAR(100) COMMENT '地区',
  bio VARCHAR(200) COMMENT '个人简介',
  openid VARCHAR(50) COMMENT '微信openid',
  is_merchant TINYINT DEFAULT 0 COMMENT '是否商家',
  status VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/disabled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  INDEX idx_phone (phone),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 统一订单表
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(30) UNIQUE NOT NULL COMMENT '订单号',
  user_id INT NOT NULL COMMENT '用户ID',
  order_type VARCHAR(50) NOT NULL COMMENT '订单类型: product/meal_booking/hotel_booking/ticket/route',
  item_id INT NOT NULL COMMENT '商品/服务ID',
  item_title VARCHAR(200) COMMENT '商品/服务标题',
  item_image VARCHAR(255) COMMENT '商品/服务图片',
  item_snapshot JSON COMMENT '商品/服务快照',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  discount_amount DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  paid_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  status VARCHAR(50) DEFAULT 'pending_pay' COMMENT '订单状态',
  merchant_id INT COMMENT '商家ID',
  extra_info JSON COMMENT '扩展信息',
  paid_at DATETIME COMMENT '支付时间',
  completed_at DATETIME COMMENT '完成时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_order_no (order_no),
  INDEX idx_merchant (merchant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一订单表';

-- 购物车表
CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL COMMENT '商品类型: product/farm_product',
  item_id INT NOT NULL,
  sku_id INT COMMENT 'SKU ID',
  item_title VARCHAR(200) NOT NULL,
  item_image VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  is_checked TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 收藏表
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  favorite_type VARCHAR(50) NOT NULL COMMENT '收藏类型',
  item_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_user_type_item (user_id, favorite_type, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 评价表
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  review_type VARCHAR(50) NOT NULL COMMENT '评价类型',
  item_id INT NOT NULL,
  rating DECIMAL(2,1) NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  images JSON COMMENT '评价图片',
  follow_up TEXT COMMENT '追评',
  reply TEXT COMMENT '商家回复',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_item (item_id, review_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- 收货地址表
CREATE TABLE user_addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(200) NOT NULL,
  is_default TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- ===================================================
-- 模块一：衣——非遗商品模块
-- ===================================================

CREATE TABLE product_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(50) COMMENT '图标',
  sort_order INT DEFAULT 0,
  parent_id INT COMMENT '父分类ID',
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL COMMENT '商品标题',
  subtitle VARCHAR(200) COMMENT '副标题',
  category_id INT NOT NULL COMMENT '分类ID',
  merchant_id INT NOT NULL COMMENT '商家ID',
  main_image VARCHAR(255) NOT NULL COMMENT '主图',
  price DECIMAL(10,2) NOT NULL COMMENT '售价',
  market_price DECIMAL(10,2) COMMENT '市场价',
  stock INT DEFAULT 0 COMMENT '库存',
  sales_count INT DEFAULT 0 COMMENT '销量',
  description TEXT COMMENT '商品描述',
  craft_intro TEXT COMMENT '工艺介绍',
  inheritor_name VARCHAR(50) COMMENT '传承人',
  status VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive',
  rating DECIMAL(3,1) DEFAULT 5.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_category (category_id),
  INDEX idx_merchant (merchant_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE product_skus (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  spec_name VARCHAR(100) NOT NULL COMMENT '规格名称',
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- ===================================================
-- 模块二：食——餐饮美食模块
-- ===================================================

CREATE TABLE restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  merchant_id INT NOT NULL,
  address VARCHAR(200) NOT NULL,
  coordinate VARCHAR(50) COMMENT '经纬度坐标',
  open_time VARCHAR(100) COMMENT '营业时间',
  capacity INT DEFAULT 50 COMMENT '容纳人数',
  description TEXT,
  main_image VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) DEFAULT 5.0,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_merchant (merchant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

CREATE TABLE dishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  main_image VARCHAR(255) NOT NULL,
  description TEXT,
  is_signature TINYINT DEFAULT 0 COMMENT '是否招牌菜',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

CREATE TABLE meal_periods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  name VARCHAR(50) NOT NULL COMMENT '时段名称',
  max_booking INT DEFAULT 30 COMMENT '最大预订数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段表';

CREATE TABLE meal_reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  user_id INT NOT NULL,
  booking_date DATE NOT NULL,
  period_id INT NOT NULL,
  people_count INT DEFAULT 1,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  remark TEXT,
  status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/confirmed/arrived/cancelled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant_date (restaurant_id, booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位预订表';

CREATE TABLE farm_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  spec VARCHAR(100) COMMENT '规格',
  stock INT DEFAULT 0,
  main_image VARCHAR(255) NOT NULL,
  origin VARCHAR(100) COMMENT '产地',
  shelf_life DATE COMMENT '保质期',
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';

-- ===================================================
-- 模块三：住——住宿预订模块
-- ===================================================

CREATE TABLE hotels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  merchant_id INT NOT NULL,
  address VARCHAR(200) NOT NULL,
  coordinate VARCHAR(50),
  style_tags VARCHAR(200) COMMENT '风格标签',
  facility_tags VARCHAR(200) COMMENT '设施标签',
  main_image VARCHAR(255) NOT NULL,
  description TEXT,
  rating DECIMAL(3,1) DEFAULT 5.0,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

CREATE TABLE room_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  name VARCHAR(100) NOT NULL COMMENT '房型名称',
  bed_type VARCHAR(50) COMMENT '床型',
  area DECIMAL(5,1) COMMENT '面积(㎡)',
  capacity INT DEFAULT 2 COMMENT '容纳人数',
  facilities VARCHAR(200) COMMENT '设施',
  price DECIMAL(10,2) NOT NULL COMMENT '基础价格',
  total_rooms INT DEFAULT 5 COMMENT '总房间数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_hotel (hotel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

CREATE TABLE room_calendars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_type_id INT NOT NULL,
  date DATE NOT NULL,
  available_count INT DEFAULT 5 COMMENT '可订数量',
  price DECIMAL(10,2) COMMENT '当日价格(可动态定价)',
  status VARCHAR(20) DEFAULT 'available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_room_date (room_type_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- ===================================================
-- 模块四：行——线路订票模块
-- ===================================================

CREATE TABLE scenic_spots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200),
  coordinate VARCHAR(50),
  open_time VARCHAR(100),
  description TEXT,
  main_image VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

CREATE TABLE ticket_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scenic_spot_id INT NOT NULL,
  name VARCHAR(50) NOT NULL COMMENT '票种名',
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 100,
  valid_days INT DEFAULT 1 COMMENT '有效期天数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_spot (scenic_spot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

CREATE TABLE tour_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  duration_days INT DEFAULT 1 COMMENT '行程天数',
  price DECIMAL(10,2) NOT NULL,
  includes TEXT COMMENT '包含项目',
  departure VARCHAR(100) COMMENT '出发地',
  destination VARCHAR(100) COMMENT '目的地',
  notice TEXT COMMENT '注意事项',
  main_image VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

CREATE TABLE route_itineraries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  day_number INT DEFAULT 1,
  description TEXT,
  scenic_spots TEXT COMMENT '景点',
  meals TEXT COMMENT '餐饮安排',
  hotel TEXT COMMENT '住宿安排',
  transport TEXT COMMENT '交通安排',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

CREATE TABLE e_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL COMMENT 'ticket/route',
  ticket_code VARCHAR(50) UNIQUE NOT NULL COMMENT '电子票码',
  valid_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'unused' COMMENT 'unused/used/refunded',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_code (ticket_code),
  INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- ===================================================
-- 模块五：社区——照片分享模块
-- ===================================================

CREATE TABLE travel_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  images JSON COMMENT '图片URL列表',
  video_url VARCHAR(255) COMMENT '视频URL',
  related_place VARCHAR(200) COMMENT '关联地点',
  topic_tags VARCHAR(500) COMMENT '话题标签',
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  fav_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending_review' COMMENT 'draft/pending_review/published/rejected',
  review_reason VARCHAR(500) COMMENT '审核原因',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

CREATE TABLE note_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  reply_to_id INT COMMENT '回复的评论ID',
  like_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_note (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

CREATE TABLE topics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  follower_count INT DEFAULT 0,
  note_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

CREATE TABLE follow_relations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  follow_user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_follow (user_id, follow_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关注关系表';

CREATE TABLE like_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  target_type VARCHAR(50) NOT NULL COMMENT 'note/comment',
  target_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_like (user_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞记录表';

CREATE TABLE report_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporter_id INT NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INT NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/handled',
  handle_result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报记录表';

-- ===================================================
-- 模块六：平台管理后台
-- ===================================================

CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL COMMENT '密码(bcrypt加密)',
  real_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  permissions JSON COMMENT '权限列表',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

CREATE TABLE merchants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL COMMENT '所属模块: clothing/food/hotel/travel',
  shop_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

CREATE TABLE merchant_applies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  materials JSON COMMENT '资质材料URL列表',
  status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/approved/rejected',
  reviewer_id INT COMMENT '审核人ID',
  review_reason TEXT COMMENT '审核原因',
  reviewed_at DATETIME COMMENT '审核时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';

CREATE TABLE platform_notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台公告表';

CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

CREATE TABLE system_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT 'system/order/interaction',
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';

CREATE TABLE operation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  operator_id INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  target VARCHAR(100) NOT NULL,
  detail TEXT,
  ip VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_operator (operator_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
