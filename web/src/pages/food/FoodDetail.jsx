/**
 * 餐厅详情页 - 菜品列表 + 餐位时段 + 预订表单
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodDetail } from '../../api/index';
import { mockRestaurants } from '../../api/mockData';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Empty from '../../components/Empty';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingInfo, setBookingInfo] = useState({ name: '', phone: '', guests: '2', date: '' });
  const [bookingMsg, setBookingMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getFoodDetail(id);
      if (res && res.data) {
        setRestaurant(res.data);
      } else {
        const found = mockRestaurants.find((r) => r.id === Number(id));
        if (found) setRestaurant(found);
        else setError(true);
      }
    } catch {
      const found = mockRestaurants.find((r) => r.id === Number(id));
      if (found) setRestaurant(found);
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!bookingInfo.name || !bookingInfo.phone || !selectedSlot || !bookingInfo.date) {
      setBookingMsg('请填写完整信息');
      return;
    }
    setBookingMsg('预订提交成功，餐厅将尽快确认');
    setTimeout(() => setBookingMsg(''), 3000);
  };

  if (loading) return <Loading />;
  if (error || !restaurant) return <ErrorMessage message="餐厅未找到" onRetry={fetchData} />;

  return (
    <div style={styles.container}>
      {/* 面包屑 */}
      <div style={styles.breadcrumb}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>首页</a>
        <span> / </span>
        <a href="/food" onClick={(e) => { e.preventDefault(); navigate('/food'); }}>餐饮美食</a>
        <span> / </span>
        <span>{restaurant.name}</span>
      </div>

      {/* 头部信息 */}
      <div style={styles.header}>
        <div style={styles.imageWrap}>
          <img src={restaurant.images?.[0] || restaurant.main_image || restaurant.image} alt={restaurant.name} style={styles.headerImage} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
        </div>
        <div style={styles.headerInfo}>
          <h1 style={styles.name}>{restaurant.name}</h1>
          <span style={styles.cuisineTag}>{restaurant.cuisine}</span>
          <div style={styles.metaRow}>
            <span style={styles.rating}>★ {restaurant.rating}</span>
            <span>人均 ¥{restaurant.pricePerPerson}</span>
            <span>{restaurant.openTime}</span>
          </div>
          <p style={styles.addr}>📍 {restaurant.address}</p>
          <p style={styles.phone}>📞 {restaurant.phone}</p>
          <p style={styles.desc}>{restaurant.description}</p>
        </div>
      </div>

      {/* 推荐菜品 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>推荐菜品</h3>
        {restaurant.dishes && restaurant.dishes.length > 0 ? (
          <div style={styles.dishGrid}>
            {restaurant.dishes.map((d) => (
              <div key={d.id} style={styles.dishCard}>
                <img src={d.image} alt={d.name} style={styles.dishImage} />
                <div style={styles.dishInfo}>
                  <h4 style={styles.dishName}>
                    {d.name}
                    {d.recommended && <span style={styles.recBadge}>推荐</span>}
                  </h4>
                  <span style={styles.dishPrice}>¥{d.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="暂无菜品信息" />
        )}
      </div>

      {/* 预订表单 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>在线预订</h3>
        <form onSubmit={handleBooking} style={styles.bookingForm}>
          <div style={styles.formRow}>
            <div style={styles.formItem}>
              <label style={styles.formLabel}>预订日期</label>
              <input
                type="date"
                value={bookingInfo.date}
                onChange={(e) => setBookingInfo((p) => ({ ...p, date: e.target.value }))}
                style={styles.formInput}
              />
            </div>
            <div style={styles.formItem}>
              <label style={styles.formLabel}>用餐时段</label>
              <div style={styles.slotRow}>
                {(restaurant.timeSlots || []).map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      ...styles.slotBtn,
                      ...(selectedSlot === slot ? styles.slotBtnActive : {}),
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formItem}>
              <label style={styles.formLabel}>联系人</label>
              <input
                type="text"
                value={bookingInfo.name}
                onChange={(e) => setBookingInfo((p) => ({ ...p, name: e.target.value }))}
                placeholder="请输入姓名"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formItem}>
              <label style={styles.formLabel}>手机号</label>
              <input
                type="tel"
                value={bookingInfo.phone}
                onChange={(e) => setBookingInfo((p) => ({ ...p, phone: e.target.value }))}
                placeholder="请输入手机号"
                style={styles.formInput}
              />
            </div>
            <div style={styles.formItem}>
              <label style={styles.formLabel}>用餐人数</label>
              <select
                value={bookingInfo.guests}
                onChange={(e) => setBookingInfo((p) => ({ ...p, guests: e.target.value }))}
                style={styles.formInput}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((n) => (
                  <option key={n} value={n}>{n}人</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" style={styles.submitBtn}>提交预订</button>
          {bookingMsg && <p style={{ ...styles.bookingMsg, color: bookingMsg.includes('成功') ? '#27AE60' : '#E74C3C' }}>{bookingMsg}</p>}
        </form>
      </div>

      {/* 评价 */}
      {restaurant.reviews && restaurant.reviews.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>用户评价 ({restaurant.reviews.length})</h3>
          {restaurant.reviews.map((rev) => (
            <div key={rev.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewUser}>{rev.user}</span>
                <span style={styles.reviewStars}>★ {rev.rating}</span>
                <span style={styles.reviewDate}>{rev.date}</span>
              </div>
              <p style={styles.reviewContent}>{rev.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '24px',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '40px',
  },
  imageWrap: {
    borderRadius: '12px',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    minHeight: '280px',
    objectFit: 'cover',
  },
  headerInfo: {},
  name: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 10px',
  },
  cuisineTag: {
    display: 'inline-block',
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '2px 10px',
    borderRadius: '4px',
    marginBottom: '12px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  rating: {
    color: '#f5a623',
    fontWeight: 600,
  },
  addr: { fontSize: '13px', color: '#999', margin: '4px 0' },
  phone: { fontSize: '13px', color: '#999', margin: '4px 0' },
  desc: { fontSize: '14px', color: '#666', lineHeight: 1.6, marginTop: '12px' },
  section: { marginBottom: '32px' },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 14px',
    paddingBottom: '8px',
    borderBottom: '2px solid #f0f0f0',
  },
  dishGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  dishCard: { backgroundColor: '#fafafa', borderRadius: '8px', overflow: 'hidden' },
  dishImage: { width: '100%', height: '140px', objectFit: 'cover' },
  dishInfo: { padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: '14px', fontWeight: 500, color: '#333', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' },
  recBadge: { fontSize: '11px', color: '#E74C3C', backgroundColor: '#FFF0F0', padding: '1px 6px', borderRadius: '4px' },
  dishPrice: { fontSize: '15px', fontWeight: 600, color: '#E74C3C' },
  bookingForm: { backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' },
  formItem: {},
  formLabel: { display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 500 },
  formInput: { width: '100%', padding: '10px 12px', border: '1px solid #d9d9d9', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  slotRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  slotBtn: { padding: '6px 14px', border: '1px solid #d9d9d9', borderRadius: '6px', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' },
  slotBtnActive: { borderColor: 'var(--primary-color)', color: 'var(--primary-color)', backgroundColor: 'rgba(31,95,168,0.05)' },
  submitBtn: { padding: '12px 40px', fontSize: '15px', fontWeight: 600, color: '#fff', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  bookingMsg: { marginTop: '10px', fontSize: '14px' },
  reviewCard: { padding: '14px 0', borderBottom: '1px solid #f0f0f0' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  reviewUser: { fontSize: '14px', fontWeight: 500, color: '#333' },
  reviewStars: { fontSize: '13px', color: '#f5a623' },
  reviewDate: { fontSize: '12px', color: '#bbb', marginLeft: 'auto' },
  reviewContent: { fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 },
};
