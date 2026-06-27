/**
 * 餐饮美食列表页 - Tab切换餐厅/农产品 + 搜索 + 分页
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFoodList, getFarmProductList } from '../../api/index';
import { mockRestaurants, mockFarmProducts } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function FoodList() {
  const [activeTab, setActiveTab] = useState('restaurant'); // restaurant / farm
  const [restaurants, setRestaurants] = useState([]);
  const [farmProducts, setFarmProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [res1, res2] = await Promise.allSettled([getFoodList(), getFarmProductList()]);
      if (res1.status === 'fulfilled' && res1.value?.data?.length > 0) {
        setRestaurants(res1.value.data);
      } else {
        setRestaurants(mockRestaurants);
      }
      if (res2.status === 'fulfilled' && res2.value?.data?.length > 0) {
        setFarmProducts(res2.value.data);
      } else {
        setFarmProducts(mockFarmProducts);
      }
    } catch {
      setRestaurants(mockRestaurants);
      setFarmProducts(mockFarmProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 根据当前 Tab + 搜索关键字获取数据
  const rawData = activeTab === 'restaurant' ? restaurants : farmProducts;

  // 关键词搜索筛选
  const filtered = keyword.trim()
    ? rawData.filter((item) => {
        const kw = keyword.toLowerCase();
        return (
          item.name?.toLowerCase().includes(kw) ||
          item.cuisine?.toLowerCase().includes(kw) ||
          item.address?.toLowerCase().includes(kw) ||
          item.origin?.toLowerCase().includes(kw)
        );
      })
    : rawData;

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 style={styles.title}>餐饮美食</h2>

      {/* Tab切换 + 搜索 */}
      <div style={styles.toolbar}>
        <div style={styles.tabs}>
          <button
            onClick={() => { setActiveTab('restaurant'); setPage(1); }}
            style={{
              ...styles.tab,
              ...(activeTab === 'restaurant' ? styles.tabActive : {}),
            }}
          >
            餐厅美食
          </button>
          <button
            onClick={() => { setActiveTab('farm'); setPage(1); }}
            style={{
              ...styles.tab,
              ...(activeTab === 'farm' ? styles.tabActive : {}),
            }}
          >
            农特产品
          </button>
        </div>
        <input
          type="text"
          placeholder={activeTab === 'restaurant' ? '搜索餐厅...' : '搜索农产品...'}
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage onRetry={fetchData} />
      ) : pageData.length === 0 ? (
        <Empty title="暂无数据" description="换个关键词试试" />
      ) : activeTab === 'restaurant' ? (
        <>
          {/* 餐厅列表 */}
          <div style={styles.grid}>
            {pageData.map((item) => (
              <Link to={`/food/${item.id}`} key={item.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img src={item.main_image || item.image} alt={item.name} style={styles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardName}>{item.name}</h3>
                  <div style={styles.tagsRow}>
                    <span style={styles.cuisine}>{item.cuisine}</span>
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.rating}>★ {item.rating}</span>
                    <span style={styles.priceRange}>人均 ¥{item.pricePerPerson}</span>
                  </div>
                  <p style={styles.address}>{item.address}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={styles.pageBtn}
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    ...styles.pageBtn,
                    ...(page === i + 1 ? styles.pageBtnActive : {}),
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={styles.pageBtn}
              >
                下一页
              </button>
              <span style={styles.pageInfo}>共 {filtered.length} 家餐厅</span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* 农产品列表 */}
          <div style={styles.grid}>
            {pageData.map((item) => (
              <Link to={`/food/farm/${item.id}`} key={item.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img src={item.main_image || item.image} alt={item.name} style={styles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardName}>{item.name}</h3>
                  <span style={styles.origin}>产地：{item.origin}</span>
                  <div style={styles.ratingRow}>
                    <span style={styles.farmPrice}>¥{item.price}</span>
                    <span style={styles.unit}>/{item.unit}</span>
                  </div>
                  <span style={styles.sales}>已售 {item.sales}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* 分页器 */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={styles.pageBtn}
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    ...styles.pageBtn,
                    ...(page === i + 1 ? styles.pageBtnActive : {}),
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={styles.pageBtn}
              >
                下一页
              </button>
              <span style={styles.pageInfo}>共 {filtered.length} 件商品</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
    height: '180px',
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
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 6px',
  },
  tagsRow: {
    marginBottom: '8px',
  },
  cuisine: {
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  origin: {
    fontSize: '12px',
    color: '#999',
    display: 'block',
    marginBottom: '8px',
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
    fontSize: '13px',
    color: '#E74C3C',
    fontWeight: 500,
  },
  farmPrice: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  unit: {
    fontSize: '13px',
    color: '#999',
  },
  address: {
    fontSize: '12px',
    color: '#999',
    margin: '4px 0 0',
  },
  sales: {
    fontSize: '12px',
    color: '#999',
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
