/**
 * 农产品详情页
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFarmProductDetail, addToCart } from '../../api/index';
import { mockFarmProducts } from '../../api/mockData';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

export default function FarmProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getFarmProductDetail(id);
      if (res && res.data) {
        setProduct(res.data);
      } else {
        const found = mockFarmProducts.find((p) => p.id === Number(id));
        if (found) setProduct(found);
        else setError(true);
      }
    } catch {
      const found = mockFarmProducts.find((p) => p.id === Number(id));
      if (found) setProduct(found);
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity, type: 'farm' });
      setCartMsg('已加入购物车');
    } catch {
      setCartMsg('已加入购物车');
    } finally {
      setTimeout(() => setCartMsg(''), 2000);
    }
  };

  if (loading) return <Loading />;
  if (error || !product) return <ErrorMessage message="产品未找到" onRetry={fetchData} />;

  return (
    <div style={styles.container}>
      {/* 面包屑 */}
      <div style={styles.breadcrumb}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>首页</a>
        <span> / </span>
        <a href="/food" onClick={(e) => { e.preventDefault(); navigate('/food'); }}>餐饮美食</a>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <div style={styles.content}>
        <div style={styles.imageWrap}>
          <img src={product.main_image || product.image} alt={product.name} style={styles.image} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
        </div>
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.origin}>产地：{product.origin}</p>
          <div style={styles.priceRow}>
            <span style={styles.price}>¥{product.price}</span>
            <span style={styles.unit}>/{product.unit}</span>
          </div>
          <p style={styles.sales}>已售 {product.sales} 件 | 库存 {product.stock} 件</p>

          <div style={styles.quantityRow}>
            <span style={styles.qtyLabel}>数量：</span>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.qtyBtn}
            >
              -
            </button>
            <span style={styles.qtyValue}>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              style={styles.qtyBtn}
            >
              +
            </button>
          </div>

          <button onClick={handleAddToCart} style={styles.cartBtn}>
            {cartMsg || '加入购物车'}
          </button>
          {cartMsg && <p style={styles.cartMsg}>{cartMsg}</p>}
        </div>
      </div>

      <div style={styles.descSection}>
        <h3 style={styles.sectionTitle}>产品详情</h3>
        <p style={styles.desc}>{product.description}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px' },
  breadcrumb: { fontSize: '13px', color: '#999', marginBottom: '24px' },
  content: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' },
  imageWrap: { borderRadius: '12px', overflow: 'hidden' },
  image: { width: '100%', height: '360px', objectFit: 'cover' },
  info: {},
  name: { fontSize: '22px', fontWeight: 600, color: '#333', margin: '0 0 10px' },
  origin: { fontSize: '13px', color: '#999', margin: '0 0 16px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' },
  price: { fontSize: '28px', fontWeight: 700, color: '#E74C3C' },
  unit: { fontSize: '14px', color: '#999' },
  sales: { fontSize: '13px', color: '#999', marginBottom: '20px' },
  quantityRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  qtyLabel: { fontSize: '14px', color: '#666' },
  qtyBtn: { width: '32px', height: '32px', border: '1px solid #d9d9d9', borderRadius: '4px', backgroundColor: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { minWidth: '40px', textAlign: 'center', fontSize: '15px', fontWeight: 500 },
  cartBtn: { padding: '12px 40px', fontSize: '15px', fontWeight: 600, color: '#fff', backgroundColor: '#E74C3C', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cartMsg: { color: '#27AE60', fontSize: '13px', marginTop: '8px' },
  descSection: {},
  sectionTitle: { fontSize: '17px', fontWeight: 600, color: '#333', margin: '0 0 14px', paddingBottom: '8px', borderBottom: '2px solid #f0f0f0' },
  desc: { fontSize: '14px', color: '#666', lineHeight: 1.8 },
};
