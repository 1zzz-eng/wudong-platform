/**
 * 非遗商品列表页 - 分类筛选 + 搜索 + 排序 + 分页
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getClothingList } from '../../api/index';
import { mockClothingProducts } from '../../api/mockData';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

const categories = ['全部', '印染', '刺绣', '织锦', '竹编', '陶瓷'];

export default function ClothingList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('default'); // default / price-asc / price-desc
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getClothingList();
      if (res && res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts(mockClothingProducts);
      }
    } catch {
      setProducts(mockClothingProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 筛选 + 搜索 + 排序
  useEffect(() => {
    let list = [...products];
    // 分类筛选
    if (activeCategory !== '全部') {
      list = list.filter((p) => p.category === activeCategory);
    }
    // 关键词搜索
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(kw) ||
          p.category?.toLowerCase().includes(kw)
      );
    }
    // 排序
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }
    setFiltered(list);
    setPage(1);
  }, [products, activeCategory, keyword, sortBy]);

  // 分页
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2 style={styles.title}>非遗商品</h2>

      {/* 筛选 + 搜索栏 */}
      <div style={styles.toolbar}>
        {/* 分类标签 */}
        <div style={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.catBtn,
                ...(activeCategory === cat ? styles.catBtnActive : {}),
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.toolRight}>
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索商品..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={styles.searchInput}
          />
          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="default">默认排序</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
          </select>
        </div>
      </div>

      {/* 商品列表 */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage onRetry={fetchProducts} />
      ) : pageData.length === 0 ? (
        <Empty title="暂无商品" description="换个关键词或分类试试" />
      ) : (
        <>
          <div style={styles.grid}>
            {pageData.map((item) => (
              <Link to={`/clothing/${item.id}`} key={item.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img src={item.main_image || item.image} alt={item.name} style={styles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                </div>
                <div style={styles.cardInfo}>
                  <span style={styles.categoryTag}>{item.category}</span>
                  <h3 style={styles.cardName}>{item.name}</h3>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>¥{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span style={styles.originalPrice}>¥{item.originalPrice}</span>
                    )}
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
    padding: '16px',
    borderRadius: '8px',
  },
  categories: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '6px 16px',
    fontSize: '13px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  catBtnActive: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    borderColor: 'var(--primary-color)',
  },
  toolRight: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    padding: '6px 14px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none',
    width: '180px',
  },
  sortSelect: {
    padding: '6px 10px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
    height: '220px',
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
  categoryTag: {
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  cardName: {
    fontSize: '15px',
    color: '#333',
    margin: '8px 0',
    fontWeight: 500,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  price: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  originalPrice: {
    fontSize: '13px',
    color: '#bbb',
    textDecoration: 'line-through',
  },
  sales: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
    display: 'block',
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
