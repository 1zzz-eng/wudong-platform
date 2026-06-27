/**
 * 民宿列表页 - 日期搜索 + 风格筛选 + 设施标签 + 分页
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHotelList } from '../../api/index';
import { mockHotels } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

const styleOptions = ['全部', '山水田园', '古镇民宿', '溪畔民宿'];

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeStyle, setActiveStyle] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getHotelList();
      if (res && res.data && res.data.length > 0) {
        setHotels(res.data);
      } else {
        setHotels(mockHotels);
      }
    } catch {
      setHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
    // 默认入住日期为明天，离店日期为后天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(tomorrow.toISOString().split('T')[0]);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    setCheckOut(dayAfter.toISOString().split('T')[0]);
  }, [fetchHotels]);

  // 筛选与搜索
  useEffect(() => {
    let list = [...hotels];

    // 风格筛选
    if (activeStyle !== '全部') {
      list = list.filter((h) => h.style === activeStyle);
    }

    // 关键词搜索
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (h) =>
          h.name?.toLowerCase().includes(kw) ||
          h.address?.toLowerCase().includes(kw) ||
          h.facilities?.some((f) => f.toLowerCase().includes(kw))
      );
    }

    setFiltered(list);
    setPage(1);
  }, [hotels, activeStyle, keyword]);

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 style={pageStyles.title}>住宿预订</h2>

      {/* 日期搜索栏 */}
      <div style={pageStyles.searchBar}>
        <div style={pageStyles.searchItem}>
          <label style={pageStyles.searchLabel}>入住日期</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={pageStyles.searchInput}
          />
        </div>
        <div style={pageStyles.searchItem}>
          <label style={pageStyles.searchLabel}>离店日期</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={pageStyles.searchInput}
          />
        </div>
        <div style={pageStyles.searchItem}>
          <label style={pageStyles.searchLabel}>人数</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            style={pageStyles.searchInput}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}人</option>
            ))}
          </select>
        </div>
      </div>

      {/* 筛选栏：风格 + 搜索 */}
      <div style={pageStyles.toolbar}>
        <div style={pageStyles.styles}>
          {styleOptions.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStyle(s)}
              style={{
                ...pageStyles.styleBtn,
                ...(activeStyle === s ? pageStyles.styleBtnActive : {}),
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜索民宿、设施..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={pageStyles.keywordInput}
        />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage onRetry={fetchHotels} />
      ) : pageData.length === 0 ? (
        <Empty title="暂无民宿" description="换个条件试试" />
      ) : (
        <>
          <div style={pageStyles.grid}>
            {pageData.map((item) => (
              <Link to={`/hotel/${item.id}`} key={item.id} style={pageStyles.card}>
                <div style={pageStyles.imageWrap}>
                  <img src={item.main_image || item.image} alt={item.name} style={pageStyles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <div style={pageStyles.cardInfo}>
                  <h3 style={pageStyles.cardName}>{item.name}</h3>
                  <div style={pageStyles.tagsRow}>
                    <span style={pageStyles.styleTag}>{item.style}</span>
                  </div>

                  {/* 设施标签 */}
                  {item.facilities && item.facilities.length > 0 && (
                    <div style={pageStyles.facilitiesWrap}>
                      {item.facilities.slice(0, 4).map((f, i) => (
                        <span key={i} style={pageStyles.facilityTag}>{f}</span>
                      ))}
                      {item.facilities.length > 4 && (
                        <span style={pageStyles.moreTag}>+{item.facilities.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div style={pageStyles.ratingRow}>
                    <span style={pageStyles.rating}>★ {item.rating}</span>
                    <span style={pageStyles.priceRange}>¥{item.priceRange}/晚</span>
                  </div>
                  <p style={pageStyles.address}>📍 {item.address}</p>
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
                style={pageStyles.pageBtn}
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
                style={pageStyles.pageBtn}
              >
                下一页
              </button>
              <span style={pageStyles.pageInfo}>共 {filtered.length} 家民宿</span>
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
  searchBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    padding: '16px 20px',
    borderRadius: '8px',
  },
  searchItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  searchLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: 500,
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
  },
  styles: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  styleBtn: {
    padding: '6px 16px',
    fontSize: '13px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  styleBtnActive: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    borderColor: 'var(--primary-color)',
  },
  keywordInput: {
    padding: '6px 14px',
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
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
  tagsRow: {
    marginBottom: '10px',
  },
  styleTag: {
    display: 'inline-block',
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  facilitiesWrap: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  facilityTag: {
    padding: '2px 10px',
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
  },
  moreTag: {
    padding: '2px 8px',
    fontSize: '11px',
    color: '#999',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  rating: {
    fontSize: '14px',
    color: '#f5a623',
    fontWeight: 600,
  },
  priceRange: {
    fontSize: '14px',
    color: '#E74C3C',
    fontWeight: 600,
  },
  address: {
    fontSize: '12px',
    color: '#999',
    margin: '4px 0 0',
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
  pageInfo: {
    fontSize: '13px',
    color: '#999',
    marginLeft: '12px',
  },
};
