import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ClothingList from './pages/clothing/ClothingList';
import ClothingDetail from './pages/clothing/ClothingDetail';
import FoodList from './pages/food/FoodList';
import FoodDetail from './pages/food/FoodDetail';
import FarmProductDetail from './pages/food/FarmProductDetail';
import HotelList from './pages/hotel/HotelList';
import HotelDetail from './pages/hotel/HotelDetail';
import TravelList from './pages/travel/TravelList';
import TravelDetail from './pages/travel/TravelDetail';
import CommunityList from './pages/community/CommunityList';
import CommunityDetail from './pages/community/CommunityDetail';
import Login from './pages/user/Login';
import Profile from './pages/user/Profile';
import Cart from './pages/user/Cart';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clothing" element={<ClothingList />} />
          <Route path="clothing/:id" element={<ClothingDetail />} />
          <Route path="food" element={<FoodList />} />
          <Route path="food/:id" element={<FoodDetail />} />
          <Route path="food/farm/:id" element={<FarmProductDetail />} />
          <Route path="hotel" element={<HotelList />} />
          <Route path="hotel/:id" element={<HotelDetail />} />
          <Route path="travel" element={<TravelList />} />
          <Route path="travel/:id" element={<TravelDetail />} />
          <Route path="community" element={<CommunityList />} />
          <Route path="community/:id" element={<CommunityDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
