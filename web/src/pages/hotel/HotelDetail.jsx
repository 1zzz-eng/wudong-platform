/**
 * 民宿详情页 - 大图 + 设施 + 房型列表(含容纳人数) + 房态日历 + 预订 + 评价
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelDetail, getHotelRooms } from '../../api/index';
import { mockHotels } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [bookMsg, setBookMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getHotelDetail(id);
      let data = null;
      if (res && res.data) {
        data = res.data;
      } else {
        data = mockHotels.find((h) => h.id === Number(id));
      }
      if (data) {
        // 尝试获取房型
        try {
          const roomRes = await getHotelRooms(id);
          if (roomRes && roomRes.data && roomRes.data.length > 0) {
            data = { ...data, rooms: roomRes.data };
          }
        } catch {
          // 使用已有房型数据
        }
        setHotel(data);
      } else {
        setError(true);
      }
    } catch {
      const found = mockHotels.find((h) => h.id === Number(id));
      if (found) setHotel(found);
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  // 生成简化房态日历（未来7天，默认均可预订）
  const generateCalendar = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        dayNum: date.getDate(),
        available: true, // 简化：默认均可预订
      });
    }
    return days;
  };

  const handleBook = (roomId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBookMsg('预订已提交，请等待确认');
    setTimeout(() => setBookMsg(''), 2000);
  };

  if (loading) return <Loading />;
  if (error || !hotel) return <ErrorMessage message="民宿未找到" onRetry={fetchData} />;

  const calendarDays = generateCalendar();

  return (
    <div style={styles.container}>
      {/* 面包屑 */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>首页</span>
        <span> / </span>
        <span style={styles.breadLink} onClick={() => navigate('/hotel')}>住宿预订</span>
        <span> / </span>
        <span>{hotel.name}</span>
      </div>

      {/* 图片画廊 */}
      <div style={styles.gallery}>
        <div style={styles.mainImageWrap}>
          <img
            src={hotel.images?.[activeImage] || hotel.main_image || hotel.image}
            alt={hotel.name}
            style={styles.mainImage}
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        </div>
        {hotel.images && hotel.images.length > 1 && (
          <div style={styles.thumbRow}>
            {hotel.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  ...styles.thumb,
                  borderColor: i === activeImage ? 'var(--primary-color)' : '#e8e8e8',
                }}
              >
                <img src={img} alt="" style={styles.thumbImg} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <div style={styles.infoSection}>
        <h1 style={styles.name}>{hotel.name}</h1>
        <div style={styles.tagsRow}>
          <span style={styles.styleTag}>{hotel.style}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.rating}>★ {hotel.rating}</span>
          <span style={styles.priceInfo}>¥{hotel.priceRange}/晚</span>
        </div>
        <p style={styles.infoLine}>📍 {hotel.address}</p>
        <p style={styles.desc}>{hotel.description}</p>

        {/* 配套设施 */}
        {hotel.facilities && hotel.facilities.length > 0 && (
          <div style={styles.facilitiesWrap}>
            <h3 style={styles.subTitle}>配套设施</h3>
            <div style={styles.facilitiesList}>
              {hotel.facilities.map((f, i) => (
                <span key={i} style={styles.facilityTag}>{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 房态日历 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>房态日历（未来7天）</h3>
        <div style={styles.calendar}>
          {calendarDays.map((day, i) => (
            <div
              key={i}
              style={{
                ...styles.calendarDay,
                ...(day.available ? styles.calendarAvailable : styles.calendarUnavailable),
              }}
            >
              <span style={styles.calendarDayNum}>{day.dayNum}</span>
              <span style={styles.calendarDayOfWeek}>{day.dayOfWeek}</span>
              <span style={styles.calendarStatus}>
                {day.available ? '可订' : '满房'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 房型列表 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>可选房型</h3>
        {hotel.rooms && hotel.rooms.length > 0 ? (
          <div style={styles.roomsList}>
            {hotel.rooms.map((room) => (
              <div key={room.id} style={styles.roomCard}>
                <div style={styles.roomImageWrap}>
                  {room.image ? (
                    <img src={room.image} alt={room.name} style={styles.roomImage} />
                  ) : (
                    <span style={styles.roomImagePlaceholder}>🏨</span>
                  )}
                </div>
                <div style={styles.roomInfo}>
                  <h4 style={styles.roomName}>{room.name}</h4>
                  <div style={styles.roomMeta}>
                    <span style={styles.roomMetaItem}>📐 {room.area || '--'}</span>
                    <span style={styles.roomMetaItem}>🛏 {room.bedType || '--'}</span>
                    <span style={styles.roomMetaItem}>
                      👥 {room.capacity || room.maxGuests || (room.bedType?.includes('+') ? 3 : 2)}人
                    </span>
                    {room.breakfast !== undefined && (
                      <span style={styles.roomMetaItem}>
                        🍳 {room.breakfast ? '含早餐' : '不含早餐'}
                      </span>
                    )}
                  </div>
                  {/* 房间设施 */}
                  {room.facilities && room.facilities.length > 0 && (
                    <div style={styles.roomFacilities}>
                      {room.facilities.map((rf, ri) => (
                        <span key={ri} style={styles.roomFacilityTag}>{rf}</span>
                      ))}
                    </div>
                  )}
                  <div style={styles.roomBottom}>
                    <span style={styles.roomPrice}>¥{room.price}/晚</span>
                    <button
                      onClick={() => handleBook(room.id)}
                      style={styles.bookBtn}
                    >
                      预订
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="暂无房型信息" />
        )}
        {bookMsg && <p style={styles.successMsg}>{bookMsg}</p>}
      </div>

      {/* 用户评价 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          用户评价 ({hotel.reviews?.length || 0})
        </h3>
        {hotel.reviews && hotel.reviews.length > 0 ? (
          <div>
            {hotel.reviews.map((rev) => (
              <div key={rev.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <span style={styles.reviewUser}>{rev.user}</span>
                  <div style={styles.reviewStars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ color: i < rev.rating ? '#f5a623' : '#d9d9d9' }}>★</span>
                    ))}
                  </div>
                  <span style={styles.reviewDate}>{rev.date}</span>
                </div>
                <p style={styles.reviewContent}>{rev.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="暂无评价" description="成为第一个评价的人吧" />
        )}
      </div>
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
  breadLink: {
    cursor: 'pointer',
    color: '#999',
  },
  gallery: {
    marginBottom: '24px',
  },
  mainImageWrap: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  mainImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    display: 'block',
  },
  thumbRow: {
    display: 'flex',
    gap: '10px',
  },
  thumb: {
    width: '80px',
    height: '60px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoSection: {
    marginBottom: '32px',
  },
  name: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 10px',
  },
  tagsRow: {
    marginBottom: '10px',
  },
  styleTag: {
    display: 'inline-block',
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '2px 10px',
    borderRadius: '4px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '15px',
    color: '#666',
    marginBottom: '8px',
    alignItems: 'center',
  },
  rating: {
    color: '#f5a623',
    fontWeight: 600,
  },
  priceInfo: {
    color: '#E74C3C',
    fontWeight: 600,
    fontSize: '16px',
  },
  infoLine: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0',
  },
  desc: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.8,
    marginTop: '12px',
  },
  facilitiesWrap: {
    marginTop: '20px',
  },
  subTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 10px',
  },
  facilitiesList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  facilityTag: {
    padding: '4px 14px',
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 14px',
    paddingBottom: '8px',
    borderBottom: '2px solid #f0f0f0',
  },
  // 房态日历样式
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
  },
  calendarDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 6px',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
    gap: '4px',
  },
  calendarAvailable: {
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  calendarUnavailable: {
    backgroundColor: '#fff2f0',
    borderColor: '#ffccc7',
  },
  calendarDayNum: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
  },
  calendarDayOfWeek: {
    fontSize: '12px',
    color: '#999',
  },
  calendarStatus: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#52c41a',
  },
  // 房型列表样式
  roomsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  roomCard: {
    display: 'flex',
    backgroundColor: '#fafafa',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  roomImageWrap: {
    width: '180px',
    minHeight: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f1fb',
    flexShrink: 0,
  },
  roomImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  roomImagePlaceholder: {
    fontSize: '40px',
  },
  roomInfo: {
    padding: '14px 18px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  roomMeta: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  roomMetaItem: {
    fontSize: '12px',
    color: '#666',
  },
  roomFacilities: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  roomFacilityTag: {
    padding: '2px 8px',
    fontSize: '11px',
    color: '#999',
    backgroundColor: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
  },
  roomBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  roomPrice: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  bookBtn: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  successMsg: {
    textAlign: 'center',
    color: '#27AE60',
    fontSize: '14px',
    marginTop: '12px',
  },
  // 评价样式
  reviewCard: {
    padding: '14px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  reviewUser: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  reviewStars: {
    fontSize: '13px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#bbb',
    marginLeft: 'auto',
  },
  reviewContent: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
    margin: 0,
  },
};
