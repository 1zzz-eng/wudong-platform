/**
 * 购物车页 - 商品列表 + 全选 + 数量调整 + 删除 + 合计 + 结算
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../../api/index';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // 加载购物车数据
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getCart();
      let cartItems = [];
      if (res && res.data) {
        cartItems = res.data.list || res.data.items || res.data;
        if (!Array.isArray(cartItems)) cartItems = [];
      }
      setItems(cartItems);
      // 默认全选
      const allIds = new Set(cartItems.map((item) => item.id || item.item_id));
      setCheckedIds(allIds);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [loadCart, navigate]);

  // 切换单个商品选中状态
  const toggleCheck = (itemId) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // 全选/全不选
  const toggleCheckAll = () => {
    if (checkedIds.size === items.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(items.map((item) => item.id || item.item_id)));
    }
  };

  // 更新数量
  const updateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    setActionLoading(true);
    try {
      await updateCartItem(itemId, { quantity: newQty });
      setItems((prev) =>
        prev.map((item) =>
          (item.id || item.item_id) === itemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch {
      // 即使接口失败也更新本地状态
      setItems((prev) =>
        prev.map((item) =>
          (item.id || item.item_id) === itemId ? { ...item, quantity: newQty } : item
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  // 删除商品
  const removeItem = async (itemId) => {
    setActionLoading(true);
    try {
      await removeCartItem(itemId);
    } catch {
      // 即使接口失败也删除本地项
    } finally {
      setItems((prev) => prev.filter((item) => (item.id || item.item_id) !== itemId));
      setCheckedIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      setActionLoading(false);
    }
  };

  // 计算选中商品的合计金额
  const selectedItems = items.filter((item) =>
    checkedIds.has(item.id || item.item_id)
  );
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // 去结算
  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate('/orders/create', { state: { items: selectedItems } });
  };

  // 去登录
  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) return <Loading text="加载购物车中..." />;

  return (
    <div>
      <h2 style={styles.title}>购物车</h2>

      {error ? (
        <ErrorMessage message="购物车加载失败" onRetry={loadCart} />
      ) : items.length === 0 ? (
        <Empty title="购物车是空的" description="去挑选心仪的商品吧" />
      ) : (
        <>
          {/* 商品列表 */}
          <div style={styles.listWrap}>
            {/* 全选栏 */}
            <div style={styles.selectAllRow}>
              <label style={styles.checkAllLabel}>
                <input
                  type="checkbox"
                  checked={checkedIds.size === items.length && items.length > 0}
                  onChange={toggleCheckAll}
                  style={styles.checkbox}
                />
                全选
              </label>
              <span style={styles.itemCount}>共 {items.length} 件商品</span>
            </div>

            {/* 购物车列表 */}
            {items.map((item) => {
              const itemId = item.id || item.item_id;
              const isChecked = checkedIds.has(itemId);
              return (
                <div key={itemId} style={styles.cartItem}>
                  {/* 勾选 */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(itemId)}
                    style={styles.checkbox}
                  />

                  {/* 商品图片 */}
                  <div style={styles.itemImageWrap}>
                    {item.item_image || item.image ? (
                      <img
                        src={item.item_image || item.image}
                        alt={item.item_title || item.name}
                        style={styles.itemImage}
                      />
                    ) : (
                      <span style={styles.imagePlaceholder}>📦</span>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemTitle}>
                      {item.item_title || item.item_name || item.name || '商品'}
                    </h4>
                    {item.specs && (
                      <span style={styles.itemSpecs}>规格：{item.specs}</span>
                    )}
                  </div>

                  {/* 单价 */}
                  <span style={styles.itemPrice}>¥{item.price || 0}</span>

                  {/* 数量调整 */}
                  <div style={styles.qtyControl}>
                    <button
                      onClick={() => updateQty(itemId, (item.quantity || 1) - 1)}
                      disabled={actionLoading || (item.quantity || 1) <= 1}
                      style={{
                        ...styles.qtyBtn,
                        ...((item.quantity || 1) <= 1 ? styles.qtyBtnDisabled : {}),
                      }}
                    >
                      -
                    </button>
                    <span style={styles.qtyValue}>{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQty(itemId, (item.quantity || 1) + 1)}
                      disabled={actionLoading}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  {/* 小计 */}
                  <span style={styles.itemSubtotal}>
                    ¥{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>

                  {/* 删除 */}
                  <button
                    onClick={() => removeItem(itemId)}
                    disabled={actionLoading}
                    style={styles.deleteBtn}
                  >
                    删除
                  </button>
                </div>
              );
            })}
          </div>

          {/* 底部结算栏 */}
          <div style={styles.footer}>
            <div style={styles.footerLeft}>
              <label style={styles.checkAllLabel}>
                <input
                  type="checkbox"
                  checked={checkedIds.size === items.length && items.length > 0}
                  onChange={toggleCheckAll}
                  style={styles.checkbox}
                />
                全选
              </label>
            </div>
            <div style={styles.footerRight}>
              <span style={styles.totalLabel}>
                已选 <span style={styles.totalCount}>{selectedItems.length}</span> 件，合计：
              </span>
              <span style={styles.totalAmount}>¥{totalAmount.toFixed(2)}</span>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0 || actionLoading}
                style={{
                  ...styles.checkoutBtn,
                  ...(selectedItems.length === 0 ? styles.checkoutBtnDisabled : {}),
                }}
              >
                去结算
              </button>
            </div>
          </div>
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
  listWrap: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '20px',
  },
  selectAllRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0',
  },
  checkAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary-color)',
  },
  itemCount: {
    fontSize: '13px',
    color: '#999',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #f5f5f5',
  },
  itemImageWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    fontSize: '32px',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#333',
    margin: '0 0 6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemSpecs: {
    fontSize: '12px',
    color: '#999',
  },
  itemPrice: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#E74C3C',
    whiteSpace: 'nowrap',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    border: '1px solid #e8e8e8',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#fafafa',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',
  },
  qtyBtnDisabled: {
    color: '#ccc',
    cursor: 'not-allowed',
  },
  qtyValue: {
    width: '36px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
    borderLeft: '1px solid #e8e8e8',
    borderRight: '1px solid #e8e8e8',
    lineHeight: '32px',
  },
  itemSubtotal: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E74C3C',
    whiteSpace: 'nowrap',
    minWidth: '70px',
    textAlign: 'right',
  },
  deleteBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    color: '#E74C3C',
    backgroundColor: 'transparent',
    border: '1px solid #E74C3C',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    bottom: '20px',
  },
  footerLeft: {},
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#666',
  },
  totalCount: {
    color: '#E74C3C',
    fontWeight: 600,
  },
  totalAmount: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#E74C3C',
  },
  checkoutBtn: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  checkoutBtnDisabled: {
    backgroundColor: '#bfbfbf',
    cursor: 'not-allowed',
  },
};
