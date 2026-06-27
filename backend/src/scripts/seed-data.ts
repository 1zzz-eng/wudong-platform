import "reflect-metadata";
import { AppDataSource } from "../config/database";
import bcrypt from "bcryptjs";

// 导入所有实体
import { User } from "../entity/user";
import { ProductCategory } from "../entity/product-category";
import { Product } from "../entity/product";
import { ProductSku } from "../entity/product-sku";
import { Restaurant, Dish, MealPeriod, FarmProduct } from "../entity/restaurant";
import { Hotel, RoomType, RoomCalendar } from "../entity/hotel";
import { ScenicSpot, TicketType, TourRoute, RouteItinerary } from "../entity/travel";
import { TravelNote, Topic, NoteComment } from "../entity/community";
import { AdminUser, Role, Banner, PlatformNotice } from "../entity/admin";

async function seed() {
  await AppDataSource.initialize();
  console.log("🌱 开始填充种子数据...");

  const pwd = await bcrypt.hash("123456", 10);

  // 创建管理员
  const adminRepo = AppDataSource.getRepository(AdminUser);
  const roleRepo = AppDataSource.getRepository(Role);
  const adminRole = await roleRepo.save(roleRepo.create({ name: "超级管理员", permissions: ["*"] }));
  const merchantRole = await roleRepo.save(roleRepo.create({ name: "商家", permissions: ["order:view", "product:manage"] }));

  await adminRepo.save(adminRepo.create({ username: "admin", password: pwd, real_name: "平台管理员", role_id: adminRole.id }));

  // 创建测试用户
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.save(userRepo.create({ phone: "13800138001", password: pwd, nickname: "旅行达人小王", avatar: "" }));
  await userRepo.save(userRepo.create({ phone: "13800138002", password: pwd, nickname: "背包客小李", avatar: "" }));

  // ====== 模块一：衣——非遗商品 ======
  const catRepo = AppDataSource.getRepository(ProductCategory);
  const catSilver = await catRepo.save(catRepo.create({ name: "苗族银饰", icon: "🏺", sort_order: 1 }));
  const catBatik = await catRepo.save(catRepo.create({ name: "蜡染工艺", icon: "🎨", sort_order: 2 }));
  const catEmbroidery = await catRepo.save(catRepo.create({ name: "苗绣制品", icon: "🧵", sort_order: 3 }));
  const catClothing = await catRepo.save(catRepo.create({ name: "苗族服饰", icon: "👘", sort_order: 4 }));

  const prodRepo = AppDataSource.getRepository(Product);
  const skuRepo = AppDataSource.getRepository(ProductSku);
  // 使用真实照片文件名
  const imgs = {
    silver1: "/uploads/5f1075f2af06c66fa7abea4e8ae896f5.jpg",
    silver2: "/uploads/253dd326dc62f94085beb96a9e2e4cff.jpg",
    batik1: "/uploads/0ee0ca7b2487928fd6c7f2aba9f649ae.jpg",
    batik2: "/uploads/ecbdfcd212ad7d33dc6146281500fa37.jpg",
    embroidery: "/uploads/97e05e6f2c5ab007a0162592de3d96c6.jpg",
    clothing: "/uploads/44af1d9758e24c9a5b83c6c7719b5de0.jpg",
    food1: "/uploads/7b6779e88cba49d688a36ff63892a0ee.jpg",
    food2: "/uploads/a4b6057638b1d3c10a07e1242829062a.jpg",
    food3: "/uploads/c0357095e9da472fc5fefa97aea90bb4.jpg",
    food4: "/uploads/40061b3fdbfe1d371ac2199698251e74.jpg",
    food5: "/uploads/f6282a47f6d274dd49e224571b4efb73.jpg",
    hotel1: "/uploads/1196398a4101347687e63ed06ee93bef.jpg",
    hotel2: "/uploads/32115ee982485549de7d6631b480c6c9.jpg",
    scenic1: "/uploads/cea73fd04e0b39c8f79b9223e533a9ea.jpg",
    scenic2: "/uploads/233b6939c4184cb77351e5652f111d36.jpg",
    banner1: "/uploads/da799b99-8790-4198-bff5-0220fd8aa458.png",
    banner2: "/uploads/01129591-dace-4140-a202-975e23f3f87a.png",
  };
  const products = [
    { title: "千锤百炼·苗银手镯", subtitle: "纯手工锻造，非遗传承人精制", category_id: catSilver.id, price: 880, market_price: 1280, main_image: imgs.silver1, craft_intro: "采用传统苗银锻造工艺，历经千锤百炼，每一件都是独一无二的艺术品。", inheritor_name: "吴大师", description: "纯银手工锻造，苗族传统纹样，寓意吉祥如意。" },
    { title: "蓝靛之韵·蜡染方巾", subtitle: "天然蓝靛染色，苗族图腾纹样", category_id: catBatik.id, price: 168, market_price: 260, main_image: imgs.batik1, craft_intro: "采用传统蜡染工艺，以蜂蜡绘制图案，天然蓝靛染色，固色持久不褪色。", inheritor_name: "杨师傅", description: "100%纯棉，手工蜡染，苗族传统几何纹样。" },
    { title: "针尖上的苗绣·刺绣挂画", subtitle: "苗族叙事刺绣，记录苗寨生活", category_id: catEmbroidery.id, price: 580, market_price: 880, main_image: imgs.embroidery, craft_intro: "运用平绣、挑花、锁绣等多种针法，一针一线勾勒苗寨风情。", inheritor_name: "龙阿婆", description: "苗族叙事刺绣挂画，记录苗族迁徙史诗与日常生活。" },
    { title: "苗韵风华·百褶裙", subtitle: "传统手工百褶，苗族盛装经典", category_id: catClothing.id, price: 1680, market_price: 2580, main_image: imgs.clothing, craft_intro: "苗族百褶裙制作技艺，从织布到褶皱，纯手工完成。", inheritor_name: "潘师傅", description: "纯手工百褶，苗族传统盛装，节庆必备。" },
    { title: "银花绽放·苗银头饰", subtitle: "苗年节庆必备，璀璨银花冠", category_id: catSilver.id, price: 2680, market_price: 3800, main_image: imgs.silver2, craft_intro: "苗族银匠三代传承技艺，银花头冠制作需耗时一个月。", inheritor_name: "吴大师", description: "苗族银花冠头饰，节庆盛装必备，纯银锻造。" },
    { title: "山水之间·蜡染壁挂", subtitle: "大幅蜡染，记录苗寨山水", category_id: catBatik.id, price: 380, market_price: 580, main_image: imgs.batik2, craft_intro: "大型蜡染壁挂，以苗族自然崇拜为灵感，记录苗寨山水之美。", inheritor_name: "杨师傅", description: "大幅手工蜡染壁挂，苗族山水主题。" },
  ];

  for (const p of products) {
    const prod = await prodRepo.save(prodRepo.create({ ...p, merchant_id: 1, stock: 100, sales_count: Math.floor(Math.random() * 500), status: "active" }));
    await skuRepo.save(skuRepo.create({ product_id: prod.id, spec_name: "标准款", price: p.price, stock: 30 }));
  }

  // ====== 模块二：食——餐饮美食 ======
  const restRepo = AppDataSource.getRepository(Restaurant);
  const dishRepo = AppDataSource.getRepository(Dish);
  const periodRepo = AppDataSource.getRepository(MealPeriod);

  const rest1 = await restRepo.save(restRepo.create({ name: "苗家长桌宴", merchant_id: 1, address: "乌东村中心广场旁", coordinate: "26.5,108.2", open_time: "10:00-21:00", capacity: 80, main_image: imgs.food1, description: "苗族传统长桌宴，体验最地道的苗族饮食文化。" }));
  await dishRepo.save(dishRepo.create({ restaurant_id: rest1.id, name: "酸汤鱼", price: 88, main_image: imgs.food2, description: "苗家秘制酸汤，新鲜河鱼", is_signature: true }));
  await dishRepo.save(dishRepo.create({ restaurant_id: rest1.id, name: "腊肉炒蕨菜", price: 48, main_image: imgs.food3, description: "苗家自制腊肉，野生蕨菜", is_signature: false }));
  await dishRepo.save(dishRepo.create({ restaurant_id: rest1.id, name: "糯米饭", price: 28, main_image: imgs.food4, description: "五色糯米饭，天然植物染色", is_signature: false }));
  await dishRepo.save(dishRepo.create({ restaurant_id: rest1.id, name: "米酒", price: 38, main_image: imgs.food5, description: "苗家自酿糯米酒，香甜醇厚", is_signature: true }));
  await periodRepo.save(periodRepo.create({ restaurant_id: rest1.id, name: "午餐 11:30-13:30", max_booking: 30 }));
  await periodRepo.save(periodRepo.create({ restaurant_id: rest1.id, name: "晚餐 17:30-19:30", max_booking: 30 }));

  const rest2 = await restRepo.save(restRepo.create({ name: "梯田观景餐厅", merchant_id: 1, address: "乌东村梯田观景台旁", coordinate: "26.51,108.21", open_time: "08:00-20:00", capacity: 50, main_image: imgs.food2, description: "坐拥千亩梯田美景，品尝地道苗家美食。" }));
  await dishRepo.save(dishRepo.create({ restaurant_id: rest2.id, name: "苗家早晨套餐", price: 35, main_image: imgs.food3, description: "糯米饭+酸菜+苗家油茶", is_signature: true }));
  await periodRepo.save(periodRepo.create({ restaurant_id: rest2.id, name: "早餐 08:00-10:00", max_booking: 20 }));
  await periodRepo.save(periodRepo.create({ restaurant_id: rest2.id, name: "午餐 11:30-14:00", max_booking: 20 }));

  // 农产品
  const farmRepo = AppDataSource.getRepository(FarmProduct);
  await farmRepo.save(farmRepo.create({ category_id: 1, name: "苗家酸汤料包", price: 35, spec: "500g/包", stock: 200, main_image: imgs.food4, origin: "乌东村", shelf_life: "2026-12-31", description: "正宗苗家酸汤，家中也能做酸汤鱼。" }));
  await farmRepo.save(farmRepo.create({ category_id: 1, name: "苗家腊肉", price: 128, spec: "1kg/条", stock: 50, main_image: imgs.food5, origin: "乌东村农户散养", shelf_life: "2026-09-30", description: "传统松枝熏制，土猪五花腊肉。" }));
  await farmRepo.save(farmRepo.create({ category_id: 1, name: "苗家糯米酒", price: 68, spec: "1L/瓶", stock: 100, main_image: imgs.food1, origin: "乌东村", shelf_life: "2027-06-30", description: "苗家传统酿造，香甜醇厚。" }));

  // ====== 模块三：住——住宿预订 ======
  const hotelRepo = AppDataSource.getRepository(Hotel);
  const roomRepo = AppDataSource.getRepository(RoomType);
  const calRepo = AppDataSource.getRepository(RoomCalendar);

  const hotel1 = await hotelRepo.save(hotelRepo.create({ name: "苗寨云端木屋", merchant_id: 1, address: "乌东村山顶", coordinate: "26.5,108.2", style_tags: "苗族木屋,观景,独栋", facility_tags: "WiFi,空调,独立卫浴,观景阳台", main_image: imgs.hotel1, description: "传统苗族吊脚楼改造，坐拥云海日出美景，推开窗便是千亩梯田。" }));
  await roomRepo.save(roomRepo.create({ hotel_id: hotel1.id, name: "苗族木屋大床房", bed_type: "大床1.8m", area: 28, capacity: 2, facilities: "WiFi,空调,独立卫浴,观景阳台", price: 388 }));
  await roomRepo.save(roomRepo.create({ hotel_id: hotel1.id, name: "苗族木屋双床房", bed_type: "双床1.2m", area: 32, capacity: 2, facilities: "WiFi,空调,独立卫浴", price: 328 }));

  const hotel2 = await hotelRepo.save(hotelRepo.create({ name: "梯田人家客栈", merchant_id: 1, address: "乌东村梯田核心区", coordinate: "26.51,108.21", style_tags: "苗寨老宅,田园风光", facility_tags: "WiFi,苗族特色,农家早餐", main_image: imgs.hotel2, description: "住在梯田怀抱中的百年苗寨老宅，体验最纯粹的苗寨生活。" }));
  await roomRepo.save(roomRepo.create({ hotel_id: hotel2.id, name: "温馨大床房", bed_type: "大床1.5m", area: 22, capacity: 2, facilities: "WiFi,苗族特色装修", price: 258 }));

  // 生成未来30天的房态日历
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);
    await calRepo.save(calRepo.create({ room_type_id: 1, date: dateStr, available_count: 5, price: 388, status: "available" }));
    await calRepo.save(calRepo.create({ room_type_id: 2, date: dateStr, available_count: 5, price: 328, status: "available" }));
    await calRepo.save(calRepo.create({ room_type_id: 3, date: dateStr, available_count: 3, price: 258, status: "available" }));
  }

  // ====== 模块四：行——线路订票 ======
  const spotRepo = AppDataSource.getRepository(ScenicSpot);
  const ticketRepo = AppDataSource.getRepository(TicketType);
  const routeRepo = AppDataSource.getRepository(TourRoute);
  const itineraryRepo = AppDataSource.getRepository(RouteItinerary);

  const spot1 = await spotRepo.save(spotRepo.create({ name: "西江千户苗寨", address: "贵州雷山县西江镇", coordinate: "26.48,108.16", open_time: "08:00-18:00", main_image: imgs.scenic1, description: "世界最大苗寨，千户苗族聚居地，感受浓郁苗族文化。" }));
  const spot2 = await spotRepo.save(spotRepo.create({ name: "乌东梯田景区", address: "贵州雷山县乌东村", coordinate: "26.5,108.2", open_time: "全天开放", main_image: imgs.scenic2, description: "千亩梯田景观，四季皆美，摄影爱好者的天堂。" }));

  await ticketRepo.save(ticketRepo.create({ scenic_spot_id: spot1.id, name: "成人票", price: 100, stock: 500, valid_days: 1 }));
  await ticketRepo.save(ticketRepo.create({ scenic_spot_id: spot1.id, name: "学生票", price: 50, stock: 300, valid_days: 1 }));
  await ticketRepo.save(ticketRepo.create({ scenic_spot_id: spot1.id, name: "家庭套票(2大1小)", price: 220, stock: 200, valid_days: 1 }));
  await ticketRepo.save(ticketRepo.create({ scenic_spot_id: spot2.id, name: "成人票", price: 60, stock: 400, valid_days: 1 }));
  await ticketRepo.save(ticketRepo.create({ scenic_spot_id: spot2.id, name: "摄影专票(含日出)", price: 120, stock: 50, valid_days: 1 }));

  const route1 = await routeRepo.save(routeRepo.create({ title: "苗寨一日游（经典版）", duration_days: 1, price: 388, includes: "门票+午餐+导游+交通", departure: "凯里/贵阳", destination: "西江千户苗寨", notice: "请穿着舒适运动鞋，注意防晒。", main_image: imgs.scenic1, description: "一天时间深度游览西江千户苗寨，感受苗族文化精髓。" }));
  await itineraryRepo.save(itineraryRepo.create({ route_id: route1.id, day_number: 1, description: "深度游览千户苗寨", scenic_spots: "西江千户苗寨、苗族博物馆、观景台、嘎歌古巷", meals: "午餐：苗家长桌宴", hotel: "-", transport: "空调大巴" }));

  const route2 = await routeRepo.save(routeRepo.create({ title: "苗寨梯田两日游（深度版）", duration_days: 2, price: 888, includes: "门票+住宿+餐饮+导游+交通", departure: "凯里/贵阳", destination: "西江千户苗寨+乌东梯田", notice: "两天一夜行程，请携带身份证及个人洗漱用品。", main_image: imgs.scenic2, description: "两天深度体验苗族文化，从千户苗寨到梯田日出。" }));
  await itineraryRepo.save(itineraryRepo.create({ route_id: route2.id, day_number: 1, description: "西江千户苗寨深度游", scenic_spots: "西江千户苗寨、苗族博物馆、银饰坊、蜡染工坊", meals: "午餐：苗家长桌宴 / 晚餐：苗家风味餐", hotel: "苗寨特色民宿", transport: "空调大巴" }));
  await itineraryRepo.save(itineraryRepo.create({ route_id: route2.id, day_number: 2, description: "乌东梯田日出+苗寨探访", scenic_spots: "乌东梯田日出、苗族自然村寨、农耕体验", meals: "早餐：苗家早晨套餐 / 午餐：农家菜", hotel: "-", transport: "空调大巴" }));

  // ====== 模块五：社区——照片分享 ======
  const noteRepo = AppDataSource.getRepository(TravelNote);
  const topicRepo = AppDataSource.getRepository(Topic);
  const commentRepo = AppDataSource.getRepository(NoteComment);

  await topicRepo.save(topicRepo.create({ name: "苗寨风光", description: "分享你眼中的苗寨美景", note_count: 1 }));
  await topicRepo.save(topicRepo.create({ name: "苗年节庆", description: "苗族节庆活动精彩瞬间", note_count: 1 }));
  await topicRepo.save(topicRepo.create({ name: "苗族美食", description: "苗家美食打卡记", note_count: 1 }));
  await topicRepo.save(topicRepo.create({ name: "非遗传承", description: "苗族非遗文化的传承故事", note_count: 0 }));

  await noteRepo.save(noteRepo.create({ user_id: 1, title: "第一次来到西江千户苗寨，太震撼了！", content: "清晨的薄雾中，千户苗寨的吊脚楼层层叠叠地排列在山坡上，像一幅水墨画。苗族阿妹穿着百褶裙从我身边走过，身上的银饰叮当作响...", images: [imgs.scenic1, imgs.hotel1, imgs.silver1], topic_tags: "苗寨风光,苗年节庆", like_count: 128, comment_count: 2, view_count: 1520, status: "published" }));
  await noteRepo.save(noteRepo.create({ user_id: 2, title: "苗家长桌宴，难忘的美食体验！", content: "第一次体验苗族的长桌宴，酸汤鱼的味道让我至今回味无穷。苗族阿妈们热情好客，不停地给我们夹菜倒酒...", images: [imgs.food1, imgs.food2], topic_tags: "苗族美食", like_count: 89, comment_count: 1, view_count: 980, status: "published" }));
  await commentRepo.save(commentRepo.create({ note_id: 1, user_id: 2, content: "拍得太美了！我也想去！" }));
  await commentRepo.save(commentRepo.create({ note_id: 1, user_id: 1, content: "谢谢！一定要来，真的不虚此行！", reply_to_id: 1 }));
  await commentRepo.save(commentRepo.create({ note_id: 2, user_id: 1, content: "酸汤鱼确实一绝！推荐去乌东村的苗家长桌宴。" }));

  // ====== 公共：Banner和公告 ======
  const bannerRepo = AppDataSource.getRepository(Banner);
  await bannerRepo.save(bannerRepo.create({ title: "苗年节庆狂欢", image_url: imgs.banner1, link_url: "/pages/community/index", sort_order: 1 }));
  await bannerRepo.save(bannerRepo.create({ title: "非遗手工艺品特惠", image_url: imgs.banner2, link_url: "/pages/clothing/list", sort_order: 2 }));
  await bannerRepo.save(bannerRepo.create({ title: "梯田民宿限时折扣", image_url: imgs.scenic2, link_url: "/pages/hotel/list", sort_order: 3 }));

  const noticeRepo = AppDataSource.getRepository(PlatformNotice);
  await noticeRepo.save(noticeRepo.create({ title: "📢 苗年节庆活动即将开始，欢迎预订！", content: "2026年苗年节将于11月举行，届时平台将推出苗年专属路线套餐，敬请期待。" }));
  await noticeRepo.save(noticeRepo.create({ title: "🎉 平台上线优惠：首次预订立减50元！", content: "新用户首次在平台预订住宿或购买路线，可享受立减50元优惠。优惠码：WUDONG50" }));

  console.log("✅ 种子数据填充完成！");
  console.log("👤 管理员: admin / 123456");
  console.log("👤 测试用户: 13800138001 / 123456");
  console.log("👤 测试用户: 13800138002 / 123456");
  await AppDataSource.destroy();
}

seed().catch(e => { console.error("❌ 种子数据填充失败:", e); process.exit(1); });
