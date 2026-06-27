import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserList from './pages/users/UserList'
import MerchantApplyList from './pages/merchant/MerchantApplyList'
import NoteReviewList from './pages/content/NoteReviewList'
import CategoryManage from './pages/clothing/CategoryManage'
import ProductManage from './pages/clothing/ProductManage'
import RestaurantManage from './pages/food/RestaurantManage'
import ReservationManage from './pages/food/ReservationManage'
import HotelManage from './pages/hotel/HotelManage'
import RoomTypeManage from './pages/hotel/RoomTypeManage'
import RoomCalendar from './pages/hotel/RoomCalendar'
import ScenicSpotManage from './pages/travel/ScenicSpotManage'
import TicketTypeManage from './pages/travel/TicketTypeManage'
import NoticeManage from './pages/NoticeManage'
import BannerManage from './pages/BannerManage'
import ReportManage from './pages/ReportManage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="merchant/apply" element={<MerchantApplyList />} />
        <Route path="content/notes" element={<NoteReviewList />} />
        <Route path="clothing/categories" element={<CategoryManage />} />
        <Route path="clothing/products" element={<ProductManage />} />
        <Route path="food/restaurants" element={<RestaurantManage />} />
        <Route path="food/reservations" element={<ReservationManage />} />
        <Route path="hotel/manage" element={<HotelManage />} />
        <Route path="hotel/rooms" element={<RoomTypeManage />} />
        <Route path="hotel/calendar" element={<RoomCalendar />} />
        <Route path="travel/spots" element={<ScenicSpotManage />} />
        <Route path="travel/tickets" element={<TicketTypeManage />} />
        <Route path="notices" element={<NoticeManage />} />
        <Route path="banners" element={<BannerManage />} />
        <Route path="reports" element={<ReportManage />} />
      </Route>
    </Routes>
  )
}
