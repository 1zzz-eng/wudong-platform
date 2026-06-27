// 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export function success<T>(data: T, message: string = "success"): ApiResponse<T> {
  return { code: 200, message, data };
}

export function fail(message: string = "操作失败", code: number = 400): ApiResponse<null> {
  return { code, message, data: null };
}

// 分页参数
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

// 分页响应
export interface PaginatedData<T> {
  total: number;
  page: number;
  pageSize: number;
  list: T[];
}

export function paginated<T>(list: T[], total: number, page: number = 1, pageSize: number = 20): PaginatedData<T> {
  return { total, page, pageSize, list };
}

// JWT 载荷
export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

// 订单状态
export enum OrderStatus {
  PENDING_PAY = "pending_pay",       // 待支付
  PAID = "paid",                     // 已支付/待确认
  CONFIRMED = "confirmed",           // 已确认
  IN_PROGRESS = "in_progress",       // 进行中
  COMPLETED = "completed",           // 已完成
  CANCELLED = "cancelled",           // 已取消
  REFUNDED = "refunded"              // 已退款
}

// 订单类型
export enum OrderType {
  PRODUCT = "product",               // 商品订单
  MEAL_BOOKING = "meal_booking",     // 餐位预订
  HOTEL_BOOKING = "hotel_booking",   // 住宿预订
  TICKET = "ticket",                 // 门票订单
  ROUTE = "route"                    // 路线订单
}
