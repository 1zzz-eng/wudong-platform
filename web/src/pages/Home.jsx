/**
 * 首页 - Banner轮播 + 模块入口 + 热门推荐
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBanners, getHotRecommendations } from '../api/index';
import { mockBanners, mockRecommendations } from '../api/mockData';
import Loading from '../components/Loading';
import Empty from '../components/Empty';
import ErrorMessage from '../components/ErrorMessage';

// 模块入口卡片配置
const moduleCards = [
  { key: 'clothing', title: '衣', subtitle: '非遗商品', desc: '蓝印花布、苗绣、竹编等传统手工艺品', icon: '🧵', color: '#E74C3C' },
  { key: 'food', title: '食', subtitle: '餐饮美食', desc: '地道农家菜、特色小吃、有机农产品', icon: '🍜', color: '#E67E22' },
  { key: 'hotel', title: '住', subtitle: '住宿预订', desc: '特色民宿、山水客栈、田园木屋', icon: '🏡', color: '#27AE60' },
  { key: 'travel', title: '行', subtitle: '旅游出行', desc: '景区门票、文化路线、深度体验', icon: '🏔️', color: '#2980B9' },
  { key: 'community', title: '社区', subtitle: '游记分享', desc: '旅行故事、美图分享、攻略交流', icon: '📷', color: '#8E44AD' },
];

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [loadingRec, setLoadingRec] = useState(true);
  const [errorBanner, setErrorBanner] = useState(false);
  const [errorRec, setErrorRec] = useState(false);

  // 获取Banner数据
  const fetchBanners = useCallback(async () => {
    setLoadingBanner(true);
    setErrorBanner(false);
    try {
      const res = await getBanners();
      if (res && res.data && res.data.length > 0) {
        setBanners(res.data);
      } else {
        // 后端无数据时使用模拟数据
        setBanners(mockBanners);
      }
    } catch {
      setBanners(mockBanners);
    } finally {
      setLoadingBanner(false);
    }
  }, []);

  // 获取热门推荐
  const fetchRecommendations = useCallback(async () => {
    setLoadingRec(true);
    setErrorRec(false);
    try {
      const res = await getHotRecommendations();
      if (res && res.data && res.data.length > 0) {
        setRecommendations(res.data);
      } else {
        setRecommendations(mockRecommendations);
      }
    } catch {
      setRecommendations(mockRecommendations);
    } finally {
      setLoadingRec(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchRecommendations();
  }, [fetchBanners, fetchRecommendations]);

  // Banner自动轮播
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div>
      {/* Banner轮播区 */}
      <section style={styles.bannerSection}>
        {loadingBanner ? (
          <Loading />
        ) : errorBanner ? (
          <ErrorMessage onRetry={fetchBanners} />
        ) : banners.length === 0 ? (
          <Empty title="暂无Banner" />
        ) : (
          <div style={styles.bannerWrapper}>
            <div
              style={{
                ...styles.bannerTrack,
                transform: `translateX(-${currentBanner * 100}%)`,
              }}
            >
              {banners.map((item, idx) => (
                <Link to={item.link || '#'} key={item.id || idx} style={styles.bannerSlide}>
                  <img src={item.image_url || item.image} alt={item.title} style={styles.bannerImg} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                  <div style={styles.bannerOverlay}>
                    <h2 style={styles.bannerTitle}>{item.title}</h2>
                    <p style={styles.bannerSubtitle}>{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* 轮播指示器 */}
            <div style={styles.dots}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  style={{
                    ...styles.dot,
                    backgroundColor: idx === currentBanner ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 模块入口卡片 */}
      <section style={styles.modulesSection}>
        <h2 style={styles.sectionTitle}>探索乌东</h2>
        <div style={styles.modulesGrid}>
          {moduleCards.map((m) => (
            <Link to={`/${m.key}`} key={m.key} style={styles.moduleCard}>
              <div style={{ ...styles.moduleIconWrap, backgroundColor: m.color }}>
                <span style={styles.moduleIcon}>{m.icon}</span>
              </div>
              <h3 style={styles.moduleTitle}>
                {m.title} <span style={styles.moduleSubtitle}>· {m.subtitle}</span>
              </h3>
              <p style={styles.moduleDesc}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门推荐区域 */}
      <section style={styles.recommendSection}>
        <h2 style={styles.sectionTitle}>热门推荐</h2>
        {loadingRec ? (
          <Loading />
        ) : errorRec ? (
          <ErrorMessage onRetry={fetchRecommendations} />
        ) : recommendations.length === 0 ? (
          <Empty title="暂无推荐" />
        ) : (
          <div style={styles.recGrid}>
            {recommendations.map((item) => (
              <div key={item.id} style={styles.recCard}>
                <div style={styles.recImageWrap}>
                  <img src={item.main_image || item.image} alt={item.title} style={styles.recImage} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                  {item.tag && <span style={styles.recTag}>{item.tag}</span>}
                </div>
                <div style={styles.recInfo}>
                  <h4 style={styles.recTitle}>{item.title}</h4>
                  <span style={styles.recPrice}>¥{item.price}起</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  bannerSection: {
    marginBottom: '40px',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  bannerWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  bannerTrack: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
  },
  bannerSlide: {
    minWidth: '100%',
    position: 'relative',
    textDecoration: 'none',
    display: 'block',
  },
  bannerImg: {
    width: '100%',
    height: '360px',
    objectFit: 'cover',
    display: 'block',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '40px 40px 30px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    color: '#fff',
  },
  bannerTitle: {
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 8px',
  },
  bannerSubtitle: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.85,
  },
  dots: {
    position: 'absolute',
    bottom: '16px',
    right: '24px',
    display: 'flex',
    gap: '8px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.3s',
  },
  modulesSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 20px',
    paddingLeft: '4px',
    borderLeft: '4px solid var(--primary-color)',
    padding: '4px 0 4px 12px',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  moduleIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  moduleIcon: {
    fontSize: '28px',
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 6px',
  },
  moduleSubtitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#999',
  },
  moduleDesc: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
    lineHeight: 1.5,
  },
  recommendSection: {
    marginBottom: '40px',
  },
  recGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  },
  recCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  recImageWrap: {
    position: 'relative',
    width: '100%',
    height: '180px',
    overflow: 'hidden',
  },
  recImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  recTag: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '2px 10px',
    fontSize: '12px',
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '10px',
  },
  recInfo: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recTitle: {
    fontSize: '15px',
    color: '#333',
    margin: 0,
    fontWeight: 500,
  },
  recPrice: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E74C3C',
  },
};
