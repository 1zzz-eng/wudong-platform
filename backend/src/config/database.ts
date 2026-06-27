import { DataSource } from "typeorm";
import path from "path";

// 导入所有实体
import { User } from "../entity/user";
import { ProductCategory } from "../entity/product-category";
import { Product } from "../entity/product";
import { ProductSku } from "../entity/product-sku";
import { ProductImage } from "../entity/product-image";
import { Restaurant, Dish, MealPeriod, MealReservation, FarmProduct } from "../entity/restaurant";
import { Hotel, RoomType, RoomCalendar } from "../entity/hotel";
import { ScenicSpot, TicketType, TourRoute, RouteItinerary, ETicket } from "../entity/travel";
import { TravelNote, NoteComment, Topic, FollowRelation, LikeRecord, ReportRecord } from "../entity/community";
import { AdminUser, Role, Merchant, MerchantApply, PlatformNotice, Banner, SystemMessage, OperationLog } from "../entity/admin";
import { Order, Cart, Favorite, Review, UserAddress } from "../entity/common";

export const AppDataSource = new DataSource({
  type: "sqljs",
  location: path.join(__dirname, "../../data/wudong.db"),
  autoSave: true,
  synchronize: true,
  logging: false,
  entities: [
    User, ProductCategory, Product, ProductSku, ProductImage,
    Restaurant, Dish, MealPeriod, MealReservation, FarmProduct,
    Hotel, RoomType, RoomCalendar,
    ScenicSpot, TicketType, TourRoute, RouteItinerary, ETicket,
    TravelNote, NoteComment, Topic, FollowRelation, LikeRecord, ReportRecord,
    AdminUser, Role, Merchant, MerchantApply, PlatformNotice, Banner,
    SystemMessage, OperationLog,
    Order, Cart, Favorite, Review, UserAddress
  ],
  migrations: [],
  subscribers: [],
});
