/**
 * API 接口集合
 * 按模块划分：公共、衣、食、住、行、社区、用户
 */

import request from './request';

// ==================== 公共接口 ====================

/** 获取首页Banner列表 */
export const getBanners = () => request.get('/api/common/banners');

/** 获取热门推荐 */
export const getHotRecommendations = () => request.get('/api/common/recommendations');

// ==================== 衣 - 非遗商品 ====================

/** 获取商品列表 */
export const getClothingList = (params) => request.get('/api/clothing', { params });

/** 获取商品详情 */
export const getClothingDetail = (id) => request.get(`/api/clothing/${id}`);

/** 获取商品评价 */
export const getClothingReviews = (id, params) => request.get(`/api/clothing/${id}/reviews`, { params });

// ==================== 食 - 餐饮美食 ====================

/** 获取餐厅列表 */
export const getFoodList = (params) => request.get('/api/food/restaurants', { params });

/** 获取餐厅详情 */
export const getFoodDetail = (id) => request.get(`/api/food/restaurants/${id}`);

/** 获取农产品列表 */
export const getFarmProductList = (params) => request.get('/api/food/farm-products', { params });

/** 获取农产品详情 */
export const getFarmProductDetail = (id) => request.get(`/api/food/farm-products/${id}`);

// ==================== 住 - 住宿预订 ====================

/** 获取民宿列表 */
export const getHotelList = (params) => request.get('/api/hotel', { params });

/** 获取民宿详情 */
export const getHotelDetail = (id) => request.get(`/api/hotel/${id}`);

/** 获取房型列表 */
export const getHotelRooms = (id) => request.get(`/api/hotel/${id}/rooms`);

// ==================== 行 - 线路订票 ====================

/** 获取景区列表 */
export const getScenicSpotList = (params) => request.get('/api/travel/scenic-spots', { params });

/** 获取景区/路线详情 */
export const getTravelDetail = (id) => request.get(`/api/travel/${id}`);

/** 获取门票列表 */
export const getTicketList = (params) => request.get('/api/travel/tickets', { params });

/** 获取路线套餐列表 */
export const getRouteList = (params) => request.get('/api/travel/routes', { params });

// ==================== 社区 - 照片分享 ====================

/** 获取游记列表 */
export const getCommunityList = (params) => request.get('/api/community/posts', { params });

/** 获取游记详情 */
export const getCommunityDetail = (id) => request.get(`/api/community/posts/${id}`);

/** 获取游记评论 */
export const getCommunityComments = (id, params) => request.get(`/api/community/posts/${id}/comments`, { params });

// ==================== 用户 ====================

/** 用户登录 */
export const login = (data) => request.post('/api/user/login', data);

/** 用户注册 */
export const register = (data) => request.post('/api/user/register', data);

/** 获取用户信息 */
export const getUserInfo = () => request.get('/api/user/profile');

/** 更新用户信息 */
export const updateUserInfo = (data) => request.put('/api/user/profile', data);

/** 获取订单列表 */
export const getOrders = (params) => request.get('/api/user/orders', { params });

/** 获取收藏列表 */
export const getFavorites = (params) => request.get('/api/user/favorites', { params });

/** 添加收藏 */
export const addFavorite = (data) => request.post('/api/user/favorites', data);

/** 取消收藏 */
export const removeFavorite = (id) => request.delete(`/api/user/favorites/${id}`);

/** 获取购物车 */
export const getCart = () => request.get('/api/user/cart');

/** 加入购物车 */
export const addToCart = (data) => request.post('/api/user/cart', data);

/** 更新购物车项 */
export const updateCartItem = (id, data) => request.put(`/api/user/cart/${id}`, data);

/** 删除购物车项 */
export const removeCartItem = (id) => request.delete(`/api/user/cart/${id}`);

/** 搜索 */
export const search = (params) => request.get('/api/common/search', { params });
