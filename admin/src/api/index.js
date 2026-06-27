import request from './request'

// ===================== 登录相关 =====================
export const adminLogin = (data) => request.post('/api/admin/login', data)
export const merchantLogin = (data) => request.post('/api/admin/merchant-login', data)

// ===================== 数据看板 =====================
export const getDashboard = () => request.get('/api/admin/dashboard')

// ===================== 用户管理 =====================
export const getUserList = (params) => request.get('/api/admin/users/list', { params })
export const toggleUserStatus = (id, status) => request.put(`/api/admin/users/${id}/status`, { status })

// ===================== 商家入驻审核 =====================
export const getMerchantApplyList = (params) => request.get('/api/admin/merchant-applies/list', { params })
export const reviewMerchantApply = (id, data) => request.put(`/api/admin/merchant-applies/${id}/review`, data)

// ===================== 内容审核 =====================
export const getNoteReviewList = (params) => request.get('/api/admin/notes/review-list', { params })
export const reviewNote = (id, data) => request.put(`/api/admin/notes/${id}/review`, data)

// ===================== 衣 - 商品管理 =====================
export const getCategoryList = () => request.get('/api/clothing/categories')
export const createCategory = (data) => request.post('/api/clothing/categories', data)
export const updateCategory = (id, data) => request.put(`/api/clothing/categories/${id}`, data)
export const deleteCategory = (id) => request.delete(`/api/clothing/categories/${id}`)

export const getProductList = (params) => request.get('/api/clothing/list', { params })
export const getProductDetail = (id) => request.get(`/api/clothing/${id}`)
export const createProduct = (data) => request.post('/api/clothing', data)
export const updateProduct = (id, data) => request.put(`/api/clothing/${id}`, data)
export const deleteProduct = (id) => request.delete(`/api/clothing/${id}`)

// ===================== 食 - 餐饮管理 =====================
export const getRestaurantList = (params) => request.get('/api/food/restaurants/list', { params })
export const createRestaurant = (data) => request.post('/api/food/restaurants', data)
export const updateRestaurant = (id, data) => request.put(`/api/food/restaurants/${id}`, data)
export const deleteRestaurant = (id) => request.delete(`/api/food/restaurants/${id}`)
export const getDishList = (params) => request.get('/api/food/dishes/list', { params })
export const createDish = (data) => request.post('/api/food/dishes', data)
export const deleteDish = (id) => request.delete(`/api/food/dishes/${id}`)

export const getReservationList = (params) => request.get('/api/food/reservations/list', { params })
export const updateReservationStatus = (id, status) => request.put(`/api/food/reservations/${id}/status`, { status })

// ===================== 住 - 住宿管理 =====================
export const getHotelList = (params) => request.get('/api/hotel/list', { params })
export const createHotel = (data) => request.post('/api/hotel', data)
export const updateHotel = (id, data) => request.put(`/api/hotel/${id}`, data)
export const deleteHotel = (id) => request.delete(`/api/hotel/${id}`)

export const getRoomTypeList = (hotelId) => request.get(`/api/hotel/room-types/${hotelId}`)
export const createRoomType = (data) => request.post('/api/hotel/room-types', data)
export const updateRoomType = (id, data) => request.put(`/api/hotel/room-types/${id}`, data)
export const deleteRoomType = (id) => request.delete(`/api/hotel/room-types/${id}`)

export const getRoomCalendar = (roomTypeId, params) => request.get(`/api/hotel/calendar/${roomTypeId}`, { params })
export const saveRoomCalendar = (data) => request.post('/api/hotel/calendar', data)
export const updateRoomCalendar = (id, data) => request.put(`/api/hotel/calendar/${id}`, data)

// ===================== 行 - 票务管理 =====================
export const getScenicSpotList = () => request.get('/api/travel/scenic-spots/list')
export const createScenicSpot = (data) => request.post('/api/travel/scenic-spots', data)
export const updateScenicSpot = (id, data) => request.put(`/api/travel/scenic-spots/${id}`, data)
export const deleteScenicSpot = (id) => request.delete(`/api/travel/scenic-spots/${id}`)

export const getTicketTypeList = (params) => request.get('/api/travel/ticket-types/list', { params })
export const createTicketType = (data) => request.post('/api/travel/ticket-types', data)
export const updateTicketType = (id, data) => request.put(`/api/travel/ticket-types/${id}`, data)
export const deleteTicketType = (id) => request.delete(`/api/travel/ticket-types/${id}`)

export const getRouteList = (params) => request.get('/api/travel/routes/list', { params })
export const createRoute = (data) => request.post('/api/travel/routes', data)
export const updateRoute = (id, data) => request.put(`/api/travel/routes/${id}`, data)
export const deleteRoute = (id) => request.delete(`/api/travel/routes/${id}`)

// ===================== 公告管理 =====================
export const getNoticeList = () => request.get('/api/admin/notices/list')
export const createNotice = (data) => request.post('/api/admin/notices', data)
export const updateNotice = (id, data) => request.put(`/api/admin/notices/${id}`, data)
export const deleteNotice = (id) => request.delete(`/api/admin/notices/${id}`)

// ===================== Banner管理 =====================
export const getBannerList = () => request.get('/api/admin/banners/list')
export const createBanner = (data) => request.post('/api/admin/banners', data)
export const updateBanner = (id, data) => request.put(`/api/admin/banners/${id}`, data)
export const deleteBanner = (id) => request.delete(`/api/admin/banners/${id}`)

// ===================== 举报处理 =====================
export const getReportList = (params) => request.get('/api/admin/reports/list', { params })
export const handleReport = (id, data) => request.put(`/api/admin/reports/${id}/handle`, data)

// ===================== 兼容旧接口名（页面可能引用这些名称） =====================
export const toggleUserBan = (id, banned) => toggleUserStatus(id, banned ? 'disabled' : 'active')
export const approveMerchantApply = (id) => reviewMerchantApply(id, { status: 'approved' })
export const rejectMerchantApply = (id, reason) => reviewMerchantApply(id, { status: 'rejected', reason })
export const getMerchantQualification = (id) => getMerchantApplyList({}).then(r => r?.list?.find?.(a => a.id === id) || null)
export const approveNote = (id) => reviewNote(id, { status: 'published' })
export const rejectNote = (id, reason) => reviewNote(id, { status: 'rejected', reason })
export const toggleProductStatus = (id, status) => updateProduct(id, { status })
export const updateTicketStock = (data) => request.put('/api/travel/ticket-types/stock', data)
export const toggleBannerStatus = (id, status) => updateBanner(id, { status })
