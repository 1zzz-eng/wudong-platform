/**
 * 景区/路线详情页 - 大图 + 描述 + 门票列表 / 行程安排 + 购买按钮
 * 路由: /travel/:id，同时支持景区和路线套餐两种类型
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTravelDetail } from '../../api/index';
import { mockScenicSpots, mockRoutes } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function TravelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [orderMsg, setOrderMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getTravelDetail(id);
      if (res && res.data) {
        setItem(res.data);
      } else {
        // 优先查景区 mock，再查路线 mock
        let found = mockScenicSpots.find((s) => s.id === Number(id));
        if (!found) found = mockRoutes.find((r) => r.id === Number(id));
        if (found) setItem(found);
        else setError(true);
      }
    } catch {
      let found = mockScenicSpots.find((s) => s.id === Number(id));
      if (!found) found = mockRoutes.find((r) => r.id === Number(id));
      if (found) setItem(found);
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  // 处理购买 / 预订
  const handlePurchase = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setOrderMsg('已加入订单，请前往结算');
    setTimeout(() => setOrderMsg(''), 2000);
  };

  if (loading) return <Loading />;
  if (error || !item) return <ErrorMessage message="未找到相关信息" onRetry={fetchData} />;

  const isRoute = item.type === '路线';

  return (
    <div style={styles.container}>
      {/* 面包屑 */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>首页</span>
        <span> / </span>
        <span style={styles.breadLink} onClick={() => navigate('/travel')}>旅游出行</span>
        <span> / </span>
        <span>{item.name}</span>
      </div>

      {/* 图片画廊 */}
      <div style={styles.gallery}>
        <div style={styles.mainImageWrap}>
          <img
            src={item.images?.[activeImage] || item.main_image || item.image}
            alt={item.name}
            style={styles.mainImage}
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <span style={styles.typeBadge}>{item.type || '景区'}</span>
        </div>
        {item.images && item.images.length > 1 && (
          <div style={styles.thumbRow}>
            {item.images.map((img, i) => (
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
        <h1 style={styles.name}>{item.name}</h1>
        <div style={styles.metaRow}>
          {item.rating && <span style={styles.rating}>★ {item.rating}</span>}
          {item.duration && <span style={styles.duration}>时长：{item.duration}</span>}
          <span style={styles.price}>
            {item.price === 0 ? '免费开放' : `¥${item.price}${isRoute ? '起' : ''}`}
          </span>
        </div>
        {item.address && <p style={styles.infoLine}>📍 {item.address}</p>}
        {item.openTime && <p style={styles.infoLine}>🕐 开放时间：{item.openTime}</p>}
        <p style={styles.desc}>{item.description}</p>

        {/* 景区亮点 */}
        {item.highlights && item.highlights.length > 0 && (
          <div style={styles.highlightsWrap}>
            <h3 style={styles.subTitle}>景区亮点</h3>
            <div style={styles.highlights}>
              {item.highlights.map((h, i) => (
                <span key={i} style={styles.highlightTag}>{h}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 门票列表（景区类型） */}
      {!isRoute && item.tickets && item.tickets.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>门票信息</h3>
          <div style={styles.ticketList}>
            {item.tickets.map((ticket) => (
              <div key={ticket.id} style={styles.ticketCard}>
                <div style={styles.ticketInfo}>
                  <h4 style={styles.ticketName}>{ticket.name}</h4>
                  <span style={styles.ticketPrice}>
                    {ticket.price === 0 ? '免费' : `¥${ticket.price}`}
                  </span>
                </div>
                <button onClick={handlePurchase} style={styles.buyBtn}>
                  {ticket.price === 0 ? '预约' : '购买'}
                </button>
              </div>
            ))}
          </div>
          {orderMsg && <p style={styles.successMsg}>{orderMsg}</p>}
        </div>
      )}
      {!isRoute && (!item.tickets || item.tickets.length === 0) && (
        <Empty title="暂无门票信息" />
      )}

      {/* 路线行程安排（路线套餐类型） */}
      {isRoute && item.itinerary && item.itinerary.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>行程安排</h3>
          <div style={styles.itinerary}>
            {item.itinerary.map((day, idx) => (
              <div key={idx} style={styles.dayCard}>
                <div style={styles.dayHeader}>
                  <span style={styles.dayDot}></span>
                  <h4 style={styles.dayTitle}>第{day.day}天：{day.title}</h4>
                </div>
                <p style={styles.dayContent}>{day.content}</p>
              </div>
            ))}
          </div>
          {item.price > 0 && (
            <button onClick={handlePurchase} style={styles.reserveBtn}>
              立即预订 ¥{item.price}
            </button>
          )}
          {orderMsg && <p style={styles.successMsg}>{orderMsg}</p>}
        </div>
      )}
      {isRoute && (!item.itinerary || item.itinerary.length === 0) && (
        <Empty title="暂无行程安排" />
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
  breadLink: {
    cursor: 'pointer',
    color: '#999',
  },
  gallery: {
    marginBottom: '24px',
  },
  mainImageWrap: {
    position: 'relative',
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    padding: '4px 14px',
    fontSize: '13px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '12px',
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
    margin: '0 0 12px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: '15px',
    color: '#f5a623',
    fontWeight: 600,
  },
  duration: {
    fontSize: '14px',
    color: '#666',
  },
  price: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#E74C3C',
    marginLeft: 'auto',
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
  highlightsWrap: {
    marginTop: '16px',
  },
  subTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 8px',
  },
  highlights: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  highlightTag: {
    padding: '4px 12px',
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
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
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  ticketCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
  },
  ticketInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  ticketName: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#333',
    margin: 0,
  },
  ticketPrice: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  buyBtn: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  itinerary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  dayCard: {
    position: 'relative',
    padding: '0 0 24px 24px',
    borderLeft: '2px solid #e8e8e8',
  },
  dayHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  dayDot: {
    position: 'absolute',
    left: '-7px',
    top: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px var(--primary-color)',
  },
  dayTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  dayContent: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
    margin: 0,
  },
  reserveBtn: {
    marginTop: '20px',
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: '#E74C3C',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  successMsg: {
    textAlign: 'center',
    color: '#27AE60',
    fontSize: '13px',
    marginTop: '10px',
  },
};
