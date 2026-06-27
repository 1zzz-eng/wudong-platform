/**
 * 旅游出行列表页 - Tab切换(景区门票/路线套餐) + 搜索 + 分页
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getScenicSpotList, getRouteList } from '../../api/index';
import { mockScenicSpots, mockRoutes } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function TravelList() {
  const [activeTab, setActiveTab] = useState('scenic'); // scenic / route
  const [scenicSpots, setScenicSpots] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [res1, res2] = await Promise.allSettled([getScenicSpotList(), getRouteList()]);
      if (res1.status === 'fulfilled' && res1.value?.data?.length > 0) {
        setScenicSpots(res1.value.data);
      } else {
        setScenicSpots(mockScenicSpots);
      }
      if (res2.status === 'fulfilled' && res2.value?.data?.length > 0) {
        setRoutes(res2.value.data);
      } else {
        setRoutes(mockRoutes);
      }
    } catch {
      setScenicSpots(mockScenicSpots);
      setRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 当前 Tab 的原始数据
  const rawData = activeTab === 'route' ? routes : scenicSpots;

  // 搜索筛选
  const filtered = keyword.trim()
    ? rawData.filter((item) => {
        const kw = keyword.toLowerCase();
        return (
          (item.name || item.title)?.toLowerCase().includes(kw) ||
          item.description?.toLowerCase().includes(kw) ||
          item.highlights?.some((h) => h.toLowerCase().includes(kw))
        );
      })
    : rawData;

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 style={pageStyles.title}>旅游出行</h2>

      {/* Tab切换 + 搜索 */}
      <div style={pageStyles.toolbar}>
        <div style={pageStyles.tabs}>
          <button
            onClick={() => { setActiveTab('scenic'); setPage(1); }}
            style={{
              ...pageStyles.tab,
              ...(activeTab === 'scenic' ? pageStyles.tabActive : {}),
            }}
          >
            景区门票
          </button>
          <button
            onClick={() => { setActiveTab('route'); setPage(1); }}
            style={{
              ...pageStyles.tab,
              ...(activeTab === 'route' ? pageStyles.tabActive : {}),
            }}
          >
            路线套餐
          </button>
        </div>
        <input
          type="text"
          placeholder={activeTab === 'scenic' ? '搜索景区...' : '搜索路线...'}
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          style={pageStyles.searchInput}
        />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage onRetry={fetchData} />
      ) : pageData.length === 0 ? (
        <Empty title="暂无数据" description="换个关键词试试" />
      ) : (
        <>
          <div style={pageStyles.grid}>
            {pageData.map((item) => (
              <Link to={`/travel/${item.id}`} key={item.id} style={pageStyles.card}>
                <div style={pageStyles.imageWrap}>
                  <img src={item.main_image || item.image} alt={item.name || item.title} style={pageStyles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                  <span style={pageStyles.typeBadge}>{item.type || '景区'}</span>
                </div>
                <div style={pageStyles.cardInfo}>
                  <h3 style={pageStyles.cardName}>{item.name || item.title}</h3>
                  {item.description && (
                    <p style={pageStyles.cardDesc}>
                      {item.description.slice(0, 60)}
                      {item.description.length > 60 ? '...' : ''}
                    </p>
                  )}
                  <div style={pageStyles.metaRow}>
                    <div style={pageStyles.metaLeft}>
                      {item.rating && <span style={pageStyles.rating}>★ {item.rating}</span>}
                      {item.duration && <span style={pageStyles.duration}>{item.duration}</span>}
                    </div>
                    <span style={pageStyles.price}>
                      {item.price === 0 ? '免费' : `¥${item.price}${item.duration ? '起' : ''}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <div style={pageStyles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  ...pageStyles.pageBtn,
                  ...(page === 1 ? pageStyles.pageBtnDisabled : {}),
                }}
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    ...pageStyles.pageBtn,
                    ...(page === i + 1 ? pageStyles.pageBtnActive : {}),
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  ...pageStyles.pageBtn,
                  ...(page === totalPages ? pageStyles.pageBtnDisabled : {}),
                }}
              >
                下一页
              </button>
              <span style={pageStyles.pageInfo}>
                共 {filtered.length} {activeTab === 'scenic' ? '个景区' : '条路线'}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const pageStyles = {
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 20px',
    paddingLeft: '4px',
    borderLeft: '4px solid var(--primary-color)',
    padding: '4px 0 4px 12px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
  },
  tab: {
    padding: '10px 28px',
    fontSize: '15px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: 'var(--primary-color)',
    fontWeight: 600,
    borderBottomColor: 'var(--primary-color)',
  },
  searchInput: {
    padding: '8px 16px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none',
    width: '200px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '3px 12px',
    fontSize: '12px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '12px',
  },
  cardInfo: {
    padding: '14px 16px',
  },
  cardName: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 6px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 10px',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rating: {
    fontSize: '14px',
    color: '#f5a623',
    fontWeight: 600,
  },
  duration: {
    fontSize: '13px',
    color: '#999',
  },
  price: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: '6px 14px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageBtnActive: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    borderColor: 'var(--primary-color)',
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: '13px',
    color: '#999',
    marginLeft: '12px',
  },
};
