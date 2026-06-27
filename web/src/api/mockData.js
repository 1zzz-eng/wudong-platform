/**
 * Mock 模拟数据 - 当后端未启动时使用
 * 所有数据均使用简体中文描述
 */

// 首页Banner数据
export const mockBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&h=400&fit=crop',
    title: '探索乌东非遗文化之美',
    subtitle: '感受传统手工艺的独特魅力',
    link: '/clothing',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
    title: '品味地道农家美食',
    subtitle: '从田间到餐桌的鲜美体验',
    link: '/food',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop',
    title: '栖居山水之间',
    subtitle: '精选特色民宿，尽享田园生活',
    link: '/hotel',
  },
];

// 热门推荐
export const mockRecommendations = [
  { id: 1, title: '蓝印花布手工体验', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop', price: 128, tag: '热门' },
  { id: 2, title: '苗绣挂画制作', image: 'https://images.unsplash.com/photo-1615443131836-4c5cb1f4b2a0?w=300&h=200&fit=crop', price: 198, tag: '新品' },
  { id: 3, title: '土家族织锦围巾', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=300&h=200&fit=crop', price: 168, tag: '推荐' },
  { id: 4, title: '竹编手工艺品', image: 'https://images.unsplash.com/photo-1610701596007-11502861ce1e?w=300&h=200&fit=crop', price: 88, tag: '精选' },
];

// 非遗商品模拟数据
export const mockClothingProducts = [
  {
    id: 1,
    name: '纯手工蓝印花布围巾',
    category: '印染',
    price: 168,
    originalPrice: 238,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop',
    ],
    description: '采用传统蓝印花布工艺，纯手工印染制作。每一件围巾都经过制版、刮浆、染色、刮白等多道工序，图案古朴自然，触感柔软舒适。',
    craftIntro: '蓝印花布是乌东地区传统印染技艺，已有数百年历史。以蓝草为染料，通过镂空版刮浆防染工艺，形成蓝白相间的独特图案。',
    inheritor: {
      name: '张秀兰',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      title: '蓝印花布非遗传承人',
      intro: '从事蓝印花布制作40余年，作品多次获得国家级工艺美术奖项。',
    },
    specs: [
      { id: 1, name: '颜色', values: ['经典蓝白', '复古靛蓝', '浅蓝'] },
      { id: 2, name: '尺寸', values: ['180cm×50cm', '200cm×60cm'] },
    ],
    stock: 50,
    sales: 1234,
    reviews: [
      { id: 1, user: '文**', avatar: '', rating: 5, content: '非常精美的手工艺品，做工细致，颜色很正，送朋友非常合适！', date: '2024-12-15' },
      { id: 2, user: '旅**', avatar: '', rating: 4, content: '质感很好，就是价格稍贵，但物有所值。', date: '2024-12-10' },
    ],
  },
  {
    id: 2,
    name: '苗绣手工挂画',
    category: '刺绣',
    price: 298,
    originalPrice: 398,
    image: 'https://images.unsplash.com/photo-1615443131836-4c5cb1f4b2a0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615443131836-4c5cb1f4b2a0?w=600&h=600&fit=crop',
    ],
    description: '苗族传统刺绣技艺制作，图案精美繁复，寓意吉祥。每一幅挂画都凝聚了绣娘数月心血。',
    craftIntro: '苗绣是苗族人民传统的手工刺绣艺术，以针法多样、色彩艳丽著称，被列入国家级非物质文化遗产名录。',
    inheritor: {
      name: '杨阿依',
      avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop',
      title: '苗绣技艺传承人',
      intro: '自幼学习苗绣，精通多种针法，致力于将传统苗绣与现代设计融合。',
    },
    specs: [
      { id: 1, name: '尺寸', values: ['30cm×40cm', '50cm×60cm', '80cm×100cm'] },
      { id: 2, name: '装裱', values: ['无框', '木框', '金属框'] },
    ],
    stock: 20,
    sales: 567,
    reviews: [
      { id: 1, user: '艺**', avatar: '', rating: 5, content: '绣工精湛，栩栩如生，挂在客厅非常好看。', date: '2024-11-20' },
    ],
  },
  {
    id: 3,
    name: '土家族织锦围巾',
    category: '织锦',
    price: 188,
    originalPrice: 268,
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop',
    ],
    description: '土家族传统织锦技艺制作，色彩丰富，图案独特，保暖性好。',
    craftIntro: '土家织锦（西兰卡普）是土家族传统手工艺，以丝、棉、麻为原料，采用通经断纬手法编织而成。',
    inheritor: {
      name: '田桂香',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      title: '土家织锦传承人',
      intro: '土家织锦技艺优秀传承人，作品曾赴多个国家展出。',
    },
    specs: [
      { id: 1, name: '颜色', values: ['红黑经典', '蓝白', '多彩'] },
      { id: 2, name: '长度', values: ['180cm', '200cm'] },
    ],
    stock: 35,
    sales: 890,
    reviews: [],
  },
  {
    id: 4,
    name: '竹编提篮',
    category: '竹编',
    price: 98,
    originalPrice: 128,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861ce1e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861ce1e?w=600&h=600&fit=crop',
    ],
    description: '采用优质毛竹纯手工编织而成，造型优美，坚固耐用，可用于日常收纳或装饰。',
    craftIntro: '竹编是乌东地区传统手工艺，以当地优质毛竹为原料，经过破竹、刮青、剖篾、编织等工序制作。',
    inheritor: {
      name: '李明德',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      title: '竹编技艺传承人',
      intro: '竹编世家第三代传人，熟练掌握上百种编织技法。',
    },
    specs: [
      { id: 1, name: '尺寸', values: ['小号20cm', '中号30cm', '大号40cm'] },
    ],
    stock: 100,
    sales: 2100,
    reviews: [],
  },
  {
    id: 5,
    name: '手工陶瓷茶具套装',
    category: '陶瓷',
    price: 358,
    originalPrice: 488,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop',
    ],
    description: '手工拉坯制作，天然釉料，一壶四杯配茶盘，送礼自用两相宜。',
    craftIntro: '乌东陶瓷制作技艺源远流长，以当地优质陶土为原料，采用传统龙窑烧制。',
    inheritor: {
      name: '王志刚',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      title: '陶瓷烧制技艺传承人',
      intro: '从事陶瓷制作30年，擅长柴烧和釉下彩技法。',
    },
    specs: [
      { id: 1, name: '釉色', values: ['天青', '月白', '茶末'] },
    ],
    stock: 15,
    sales: 456,
    reviews: [],
  },
  {
    id: 6,
    name: '手工刺绣香囊',
    category: '刺绣',
    price: 58,
    originalPrice: 78,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=600&h=600&fit=crop',
    ],
    description: '精选天然香料填充，手工刺绣花纹，小巧精致，可做车挂或随身饰品。',
    craftIntro: '香囊制作融合了刺绣和中药配伍双重技艺，是传统民俗与手工艺的完美结合。',
    inheritor: {
      name: '赵小娟',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      title: '刺绣香囊传承人',
      intro: '擅长多种刺绣针法，制作的香囊深受年轻人喜爱。',
    },
    specs: [
      { id: 1, name: '香味', values: ['艾草', '薰衣草', '桂花'] },
    ],
    stock: 200,
    sales: 3200,
    reviews: [],
  },
];

// 餐饮美食模拟数据
export const mockRestaurants = [
  {
    id: 1,
    name: '乌东土菜馆',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    ],
    cuisine: '本地农家菜',
    rating: 4.8,
    pricePerPerson: 65,
    address: '乌东县古镇老街88号',
    phone: '0578-12345678',
    openTime: '10:00-21:00',
    description: '传承三代的本地土菜馆，坚持使用自家种植的有机蔬菜和散养家禽，还原乌东最地道的农家味道。',
    dishes: [
      { id: 1, name: '土鸡炖蘑菇', image: 'https://images.unsplash.com/photo-1598103442097-8b74494b0e5f?w=150&h=150&fit=crop', price: 88, recommended: true },
      { id: 2, name: '农家小炒肉', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=150&h=150&fit=crop', price: 42, recommended: true },
      { id: 3, name: '咸肉蒸笋', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&h=150&fit=crop', price: 38, recommended: false },
      { id: 4, name: '清蒸溪鱼', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=150&h=150&fit=crop', price: 58, recommended: false },
      { id: 5, name: '手工豆腐煲', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=150&h=150&fit=crop', price: 32, recommended: true },
    ],
    timeSlots: ['11:00-12:30', '12:30-14:00', '17:00-18:30', '18:30-20:00'],
    reviews: [
      { id: 1, user: '美**', rating: 5, content: '地道的农家菜，土鸡炖蘑菇特别好吃，环境也很干净。', date: '2024-12-18' },
      { id: 2, user: '吃**', rating: 4.5, content: '价格实惠量又足，推荐小炒肉和豆腐煲。', date: '2024-12-12' },
    ],
  },
  {
    id: 2,
    name: '山水间素食坊',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop',
    ],
    cuisine: '素食/斋菜',
    rating: 4.6,
    pricePerPerson: 48,
    address: '乌东县风景区入口旁',
    phone: '0578-87654321',
    openTime: '09:00-20:00',
    description: '坐落于山水之间的素食餐厅，选用本地时令蔬菜和山珍，倡导健康饮食理念。',
    dishes: [
      { id: 1, name: '山菌杂菇煲', image: 'https://images.unsplash.com/photo-1432139555190-0a70b07e6a5a?w=150&h=150&fit=crop', price: 45, recommended: true },
      { id: 2, name: '素炒时蔬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop', price: 28, recommended: false },
      { id: 3, name: '竹筒糯米饭', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=150&h=150&fit=crop', price: 22, recommended: true },
    ],
    timeSlots: ['11:00-12:30', '12:30-14:00', '17:00-18:30'],
    reviews: [],
  },
  {
    id: 3,
    name: '老镇烧烤大院',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    ],
    cuisine: '烧烤/夜宵',
    rating: 4.3,
    pricePerPerson: 55,
    address: '乌东县古镇南街22号',
    phone: '0578-23456789',
    openTime: '16:00-02:00',
    description: '乌东人气最旺的烧烤店，使用果木炭烤制，香气四溢，是夜宵聚会的好去处。',
    dishes: [
      { id: 1, name: '烤羊排', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&h=150&fit=crop', price: 68, recommended: true },
      { id: 2, name: '烤鱼', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=150&h=150&fit=crop', price: 78, recommended: true },
    ],
    timeSlots: ['17:00-19:00', '19:00-21:00'],
    reviews: [],
  },
];

// 农产品模拟数据
export const mockFarmProducts = [
  {
    id: 1,
    name: '乌东高山有机茶',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    price: 288,
    unit: '500g',
    origin: '乌东县云雾山',
    description: '生长在海拔800米以上的高山茶园，云雾缭绕，不施农药化肥。茶汤清亮，回甘悠长。',
    sales: 3200,
    stock: 500,
  },
  {
    id: 2,
    name: '农家自榨山茶油',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    price: 128,
    unit: '1L',
    origin: '乌东县古法油坊',
    description: '采用传统冷榨工艺，保留茶籽天然营养，色泽金黄，清香扑鼻。',
    sales: 1800,
    stock: 200,
  },
  {
    id: 3,
    name: '野生椴木香菇',
    image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb8af?w=400&h=300&fit=crop',
    price: 88,
    unit: '200g',
    origin: '乌东县原始林区',
    description: '采自深山原始林区椴木上自然生长的香菇，肉质厚实，香味浓郁。',
    sales: 5600,
    stock: 150,
  },
  {
    id: 4,
    name: '手工红薯粉条',
    image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop',
    price: 35,
    unit: '1kg',
    origin: '乌东县农家手工坊',
    description: '传统手工漏粉工艺制作，无任何添加，口感劲道爽滑。',
    sales: 8900,
    stock: 800,
  },
];

// 民宿模拟数据
export const mockHotels = [
  {
    id: 1,
    name: '云栖山居',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    ],
    style: '山水田园',
    rating: 4.9,
    priceRange: '388-888',
    address: '乌东县云雾山半山腰',
    description: '坐落在云雾山半山腰的精品民宿，每间客房均可欣赏山景云海，设计融合传统与现代。',
    facilities: ['免费WiFi', '停车场', '餐厅', '茶室', '观景台', '温泉泡池'],
    rooms: [
      { id: 1, name: '山景大床房', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=200&fit=crop', price: 388, area: '35m²', bedType: '1.8m大床', breakfast: true },
      { id: 2, name: '云海观景套房', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop', price: 688, area: '55m²', bedType: '1.8m大床', breakfast: true },
      { id: 3, name: '家庭亲子套房', image: 'https://images.unsplash.com/photo-1598928506311-c55def1fcc24?w=300&h=200&fit=crop', price: 888, area: '70m²', bedType: '1.8m+1.2m', breakfast: true },
    ],
    reviews: [
      { id: 1, user: '旅**', rating: 5, content: '风景绝佳，早上起来看到云海太震撼了！服务也很贴心。', date: '2024-12-20' },
    ],
  },
  {
    id: 2,
    name: '古镇客栈',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop',
    ],
    style: '古镇民宿',
    rating: 4.7,
    priceRange: '188-488',
    address: '乌东县古镇老街56号',
    description: '改造自百年老宅的精品客栈，保留原有建筑风貌，融入现代舒适设施，出门即古镇老街。',
    facilities: ['免费WiFi', '庭院', '茶室', '阅览室', '洗衣服务'],
    rooms: [
      { id: 1, name: '庭院标准间', image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=300&h=200&fit=crop', price: 188, area: '22m²', bedType: '1.5m双人床', breakfast: false },
      { id: 2, name: '老宅阁楼套房', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop', price: 488, area: '45m²', bedType: '2.0m大床', breakfast: true },
    ],
    reviews: [],
  },
  {
    id: 3,
    name: '溪畔人家',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop',
    ],
    style: '溪畔民宿',
    rating: 4.5,
    priceRange: '258-598',
    address: '乌东县溪口村12号',
    description: '依溪而建的乡村民宿，推窗即见潺潺流水，夜晚伴溪声入眠。提供垂钓、采摘等农事体验。',
    facilities: ['免费WiFi', '停车场', '烧烤区', '垂钓区', '采摘园'],
    rooms: [
      { id: 1, name: '溪景双床房', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&h=200&fit=crop', price: 258, area: '28m²', bedType: '1.2m双床', breakfast: true },
      { id: 2, name: '全景木屋', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5ae18?w=300&h=200&fit=crop', price: 598, area: '50m²', bedType: '1.8m大床', breakfast: true },
    ],
    reviews: [],
  },
];

// 景区/路线模拟数据
export const mockScenicSpots = [
  {
    id: 1,
    name: '云雾山风景区',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
    ],
    type: '景区',
    rating: 4.7,
    price: 80,
    address: '乌东县云雾山镇',
    description: '云雾山是国家4A级旅游景区，主峰海拔1200米，常年云雾缭绕。景区内有云海日出、千年古松、瀑布群等自然景观，同时还有古村落和非遗体验区。',
    openTime: '08:00-17:00',
    highlights: ['云海日出', '古松群', '龙潭瀑布', '玻璃栈道', '非遗工坊'],
    tickets: [
      { id: 1, name: '成人票', price: 80 },
      { id: 2, name: '学生/老人票', price: 40 },
      { id: 3, name: '家庭套票（2大1小）', price: 180 },
    ],
  },
  {
    id: 2,
    name: '乌东古镇',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    ],
    type: '景区',
    rating: 4.5,
    price: 0,
    address: '乌东县古镇区',
    description: '乌东古镇拥有600多年历史，保存完好的明清建筑群，青石板街道蜿蜒曲折，是感受乌东文化的最佳去处。免费开放。',
    openTime: '全天',
    highlights: ['明清古建筑', '青石板街', '非遗展示馆', '老茶馆', '手工艺作坊'],
    tickets: [
      { id: 1, name: '古镇免费游览', price: 0 },
      { id: 2, name: '非遗展示馆', price: 30 },
    ],
  },
];

export const mockRoutes = [
  {
    id: 3,
    name: '乌东三日深度文化游',
    image: 'https://images.unsplash.com/photo-1530789253388-930c80bdc8f5?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1530789253388-930c80bdc8f5?w=600&h=400&fit=crop',
    ],
    type: '路线',
    rating: 4.8,
    price: 1288,
    duration: '3天2晚',
    description: '深度体验乌东非遗文化、自然风光和特色美食的精品三日游路线。包含住宿、餐饮、门票和导游服务。',
    itinerary: [
      { day: 1, title: '抵达乌东 - 古镇探秘', content: '上午抵达乌东，入住古镇客栈；下午游览乌东古镇、非遗展示馆；晚上品尝地道土菜。' },
      { day: 2, title: '云雾山全天游', content: '清晨看云海日出，全天游览云雾山景区，体验非遗手工制作，晚上篝火晚会。' },
      { day: 3, title: '乡村体验 - 返程', content: '上午体验农耕、采摘，品尝农家饭；下午参观苗寨，购买特产纪念品后返程。' },
    ],
  },
  {
    id: 4,
    name: '非遗文化体验一日游',
    image: 'https://images.unsplash.com/photo-1604265800222-46a6e808efb8?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1604265800222-46a6e808efb8?w=600&h=400&fit=crop',
    ],
    type: '路线',
    rating: 4.6,
    price: 388,
    duration: '1天',
    description: '一天之内体验蓝印花布、苗绣、陶艺三项非遗技艺，适合亲子家庭和文化爱好者。',
    itinerary: [
      { day: 1, title: '非遗一日游', content: '上午蓝印花布工坊体验(2h)；下午苗绣工作室体验(2h)+陶瓷工坊体验(2h)；含午餐。' },
    ],
  },
];

// 游记模拟数据
export const mockPosts = [
  {
    id: 1,
    title: '乌东古镇：穿越六百年的时光之旅',
    cover: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    author: { name: '旅行达人小王', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop' },
    createTime: '2024-12-20',
    viewCount: 2356,
    likeCount: 189,
    commentCount: 23,
    liked: false,
    summary: '一条青石板路，两排斑驳的老墙，乌东古镇像一个沉睡的美人，安静地等待着有缘人的到来...',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=500&fit=crop',
    ],
    content: `在一个阳光明媚的周末，我终于踏上了前往乌东古镇的旅程。

古镇坐落于群山环抱之中，一条清澈的小溪穿镇而过。走进古镇，仿佛穿越了时空——青石板铺就的街道，白墙黛瓦的老屋，每一处都透着历史的厚重。

最让我惊喜的是镇上的非遗展示馆。在这里，我亲眼见证了蓝印花布的制作全过程，从刻板、上浆到染色，每一步都凝聚着匠人的心血。一位年过六旬的老奶奶正在教游客制作简单的印染作品，她的双手布满老茧，却异常灵巧。

中午在古镇的老茶馆歇脚，点了一壶本地的高山茶，配上一碟手工点心，听着邻桌老人用方言聊天，那种悠闲自得的感觉是在城市里无论如何也体会不到的。

傍晚时分，夕阳的余晖洒在石板路上，整个古镇都被染成了金色。我站在古桥上，看着溪水悠悠流淌，心中充满了对这片土地的眷恋。

如果你也想逃离城市的喧嚣，不妨来乌东古镇走一走，感受一下慢生活的美好。`,
    comments: [
      { id: 1, user: { name: '文**', avatar: '' }, content: '写得真好！我也好想去看看。', time: '2024-12-20 14:30', likeCount: 12 },
      { id: 2, user: { name: '摄**', avatar: '' }, content: '照片拍得很美，用什么相机拍的？', time: '2024-12-20 15:10', likeCount: 5 },
      { id: 3, user: { name: '本**', avatar: '' }, content: '作为乌东本地人，看到家乡被这样赞美真的很开心。', time: '2024-12-20 16:00', likeCount: 28 },
    ],
  },
  {
    id: 2,
    title: '云雾山日出——此生必看的美景',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    author: { name: '摄影老张', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop' },
    createTime: '2024-12-18',
    viewCount: 4521,
    likeCount: 356,
    commentCount: 45,
    liked: true,
    summary: '凌晨四点起床，摸黑登山两小时，当太阳从云海中升起的那一刻，一切都值了...',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
    ],
    content: `云雾山的日出，是我看过最美的日出，没有之一。

凌晨四点，我们打着手电筒从民宿出发。山路不算太难走，但黑暗中只能看到前方几米的路。向导说，最好的观景点在山顶的"望日台"，需要大约一个半小时。

五点半左右，我们到达了望日台。天色已经开始微微发亮，东方的天际线泛起了一丝鱼肚白。脚下是一片翻涌的云海，如同白色的海洋，远处的山峰像岛屿一样点缀其中。

六点零三分，太阳终于露出了一小段圆弧。那一刻，整个世界都被染成了金色——云海变成了金色，山峰变成了金色，连我们的脸庞都泛着金光。所有人都安静了下来，只有相机的快门声此起彼伏。

如果你问我看日出的感受，我只能说：人间值得。

Tips：
1. 建议提前一天入住山上的民宿，第二天不用太赶
2. 看日出需要早起，一般凌晨4点出发
3. 山上温度低，即使是夏天也要带件外套
4. 记得带上手电筒和充足的水`,
    comments: [
      { id: 1, user: { name: '风**', avatar: '' }, content: '太美了！列入明年出行计划。', time: '2024-12-18 10:00', likeCount: 15 },
    ],
  },
  {
    id: 3,
    title: '在乌东，我学会了蓝印花布',
    cover: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop',
    author: { name: '手艺爱好者', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
    createTime: '2024-12-15',
    viewCount: 1890,
    likeCount: 142,
    commentCount: 18,
    liked: false,
    summary: '一直对手工艺很感兴趣，这次终于在乌东体验了蓝印花布的制作，成就感满满...',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1615443131836-4c5cb1f4b2a0?w=800&h=500&fit=crop',
    ],
    content: `一直对手工艺有着浓厚的兴趣，这次乌东之行，特意预约了蓝印花布体验课程。

工坊就在古镇的一条小巷里，推门进去，满院子都晾着刚刚染好的蓝布，在阳光下散发着淡淡的蓝草香气。

张老师是蓝印花布的非遗传承人，已经做了四十多年。她先给我们讲解了蓝印花布的历史和工艺流程——从设计图案、雕刻花版、调制防染浆、刮浆、染色到最后的去浆晾晒，前前后后要十几道工序。

动手环节是我最期待的。张老师发给我们每人一块已经刮好浆的白布，让我们自己尝试染色。将布浸入染缸的那一刻，看着白色慢慢变成浅蓝，再变成深蓝，心里涌起一种说不出的满足感。

最后展开成品时，白色的花纹在深蓝的底色上格外醒目。虽然我的作品远没有张老师做的那么精美，但这份独一无二的体验将永远留在我的记忆里。

如果你也对传统手工艺感兴趣，非常推荐来体验一下。费用大约是100元/人，包含材料费和指导费。`,
    comments: [],
  },
  {
    id: 4,
    title: '乌东美食探店｜这些地道味道你一定不能错过',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    author: { name: '吃货小分队', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
    createTime: '2024-12-10',
    viewCount: 5678,
    likeCount: 423,
    commentCount: 67,
    liked: false,
    summary: '在乌东待了三天，把镇上的大小餐馆几乎吃了个遍，整理出这份美食攻略...',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
    ],
    content: `乌东不仅风景美，美食也是一绝！三天时间，我和小伙伴们把镇上口碑好的馆子刷了一遍，以下是我们的诚意推荐：

【早餐篇】
推荐古镇街口的"老味道早餐铺"，豆浆油条、小笼包、豆腐花都是现做现卖，价格实惠，人均15元就能吃好吃饱。

【正餐篇】
首推"乌东土菜馆"，传承三代的老店。必点菜：土鸡炖蘑菇（88元）、农家小炒肉（42元）、手工豆腐煲（32元）。食材都是自家种的，味道正宗。

【夜宵篇】
"老镇烧烤大院"是乌东人最爱的夜宵去处。果木炭烤的羊排外焦里嫩，烤鱼鲜香入味。下午四点才开门，一直营业到凌晨。

【特产篇】
走的时候别忘了带些当地的农产品：高山有机茶、手工红薯粉条、野生椴木香菇，都是不错的伴手礼选择。`,
    comments: [],
  },
];

// 搜索模拟数据
export const mockSearchResults = (keyword) => {
  const all = [
    ...mockClothingProducts.map((i) => ({ ...i, category: 'clothing' })),
    ...mockRestaurants.map((i) => ({ ...i, category: 'food' })),
    ...mockHotels.map((i) => ({ ...i, category: 'hotel' })),
    ...mockScenicSpots.map((i) => ({ ...i, category: 'travel' })),
    ...mockPosts.map((i) => ({ ...i, category: 'community' })),
  ];
  if (!keyword) return all.slice(0, 10);
  const kw = keyword.toLowerCase();
  return all.filter(
    (item) =>
      item.name?.toLowerCase().includes(kw) ||
      item.title?.toLowerCase().includes(kw) ||
      item.description?.toLowerCase().includes(kw)
  ).slice(0, 10);
};
