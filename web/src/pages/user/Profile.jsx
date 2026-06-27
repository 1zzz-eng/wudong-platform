/**
 * 个人中心页 - 用户信息 + Tab切换(我的订单/我的收藏/设置)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, getOrders, getFavorites } from '../../api/index';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
import ErrorMessage from '../../components/ErrorMessage';

// 订单状态映射
const statusLabels = {
  pending_pay: '待支付',
  paid: '已支付',
  confirmed: '已确认',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
};

const statusColors = {
  pending_pay: '#FAAD14',
  paid: '#1F5FA8',
  confirmed: '#52C41A',
  in_progress: '#1F5FA8',
  completed: '#52C41A',
  cancelled: '#8C8C8C',
  refunded: '#FF4D4F',
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // orders / favorites / settings
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // 加载用户信息
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch {
        setUserInfo({ nickname: '用户' });
      }
    } else {
      setUserInfo({ nickname: '用户' });
    }
    setLoading(false);
  }, [navigate]);

  // 加载订单或收藏
  const loadTabData = useCallback(async () => {
    setDataLoading(true);
    setDataError(false);
    try {
      if (activeTab === 'orders') {
        const res = await getOrders({ page: 1, pageSize: 20 });
        if (res && res.data) {
          setOrders(res.data.list || res.data || []);
        }
      } else if (activeTab === 'favorites') {
        const res = await getFavorites({ page: 1, pageSize: 20 });
        if (res && res.data) {
          setFavorites(res.data.list || res.data || []);
        }
      }
    } catch {
      setDataError(true);
    } finally {
      setDataLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'settings') {
      loadTabData();
    }
  }, [activeTab, loadTabData]);

  // 退出登录
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // 获取收藏项类型的中文名
  const getFavoriteType = (type) => {
    const map = { clothing: '非遗商品', food: '餐饮美食', hotel: '民宿', travel: '旅游', community: '游记' };
    return map[type] || type || '其他';
  };

  if (loading) return <Loading />;

  return (
    <div>
      {/* 用户信息卡片 */}
      <div style={styles.userCard}>
        <div style={styles.userCardInner}>
          <div style={styles.userLeft}>
            <div style={styles.avatarWrap}>
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="" style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarIcon}>👤</span>
              )}
            </div>
            <div style={styles.userText}>
              <h3 style={styles.userName}>{userInfo?.nickname || userInfo?.name || '用户'}</h3>
              <p style={styles.userBio}>{userInfo?.bio || userInfo?.intro || '这个人很懒，什么都没写...'}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>退出登录</button>
        </div>
      </div>

      {/* Tab切换 */}
      <div style={styles.tabs}>
        {[
          { key: 'orders', label: '我的订单' },
          { key: 'favorites', label: '我的收藏' },
          { key: 'settings', label: '账号设置' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab内容区 */}
      <div style={styles.tabContent}>
        {/* 我的订单 */}
        {activeTab === 'orders' && (
          <>
            {dataLoading ? (
              <Loading text="加载订单中..." />
            ) : dataError ? (
              <ErrorMessage message="订单加载失败" onRetry={loadTabData} />
            ) : orders.length === 0 ? (
              <Empty title="还没有订单" description="去逛逛吧" />
            ) : (
              <div style={styles.orderList}>
                {orders.map((order) => (
                  <div key={order.id || order.order_no} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderNo}>
                        订单号：{order.order_no || order.orderNo || order.id}
                      </span>
                      <span
                        style={{
                          ...styles.orderStatus,
                          backgroundColor: (statusColors[order.status] || '#8C8C8C') + '20',
                          color: statusColors[order.status] || '#8C8C8C',
                        }}
                      >
                        {statusLabels[order.status] || order.status || '未知'}
                      </span>
                    </div>
                    <div style={styles.orderBody}>
                      {order.item_image && (
                        <img src={order.item_image} alt="" style={styles.orderImage} />
                      )}
                      <div style={styles.orderInfo}>
                        <h4 style={styles.orderTitle}>
                          {order.item_title || order.item_name || order.title || '商品订单'}
                        </h4>
                        {order.item_type && (
                          <span style={styles.orderType}>
                            {getFavoriteType(order.item_type || order.type)}
                          </span>
                        )}
                      </div>
                      <span style={styles.orderAmount}>
                        ¥{order.paid_amount || order.amount || order.price || 0}
                      </span>
                    </div>
                    <div style={styles.orderActions}>
                      {order.status === 'pending_pay' && (
                        <button style={styles.payBtn}>去支付</button>
                      )}
                      <button style={styles.detailBtn}>查看详情</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 我的收藏 */}
        {activeTab === 'favorites' && (
          <>
            {dataLoading ? (
              <Loading text="加载收藏中..." />
            ) : dataError ? (
              <ErrorMessage message="收藏加载失败" onRetry={loadTabData} />
            ) : favorites.length === 0 ? (
              <Empty title="还没有收藏" description="去发现喜欢的内容吧" />
            ) : (
              <div style={styles.favGrid}>
                {favorites.map((fav) => (
                  <div key={fav.id || fav.item_id} style={styles.favCard}>
                    {fav.item_image && (
                      <div style={styles.favImageWrap}>
                        <img src={fav.item_image} alt="" style={styles.favImage} />
                      </div>
                    )}
                    <div style={styles.favInfo}>
                      <span style={styles.favType}>{getFavoriteType(fav.favorite_type || fav.type)}</span>
                      <h4 style={styles.favTitle}>{fav.item_title || fav.item_name || '收藏项'}</h4>
                      {fav.price > 0 && <span style={styles.favPrice}>¥{fav.price}</span>}
                    </div>
                    <Link
                      to={`/${fav.favorite_type || fav.type || ''}/${fav.item_id || fav.id}`}
                      style={styles.viewLink}
                    >
                      查看
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 账号设置 */}
        {activeTab === 'settings' && (
          <div style={styles.settingsWrap}>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>手机号</span>
              <span style={styles.settingValue}>
                {userInfo?.phone || '未绑定'}
                <button style={styles.changeBtn}>修改</button>
              </span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>昵称</span>
              <span style={styles.settingValue}>
                {userInfo?.nickname || userInfo?.name || '未设置'}
                <button style={styles.changeBtn}>修改</button>
              </span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>密码</span>
              <span style={styles.settingValue}>
                ********
                <button style={styles.changeBtn}>修改</button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  userCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  userCardInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#E8F1FB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarIcon: {
    fontSize: '28px',
  },
  userText: {},
  userName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 4px',
  },
  userBio: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    color: '#666',
    cursor: 'pointer',
    fontSize: '13px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    fontSize: '14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    fontWeight: 500,
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    minHeight: '300px',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderCard: {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    padding: '16px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderNo: {
    fontSize: '13px',
    color: '#999',
  },
  orderStatus: {
    fontSize: '12px',
    padding: '2px 10px',
    borderRadius: '4px',
    fontWeight: 500,
  },
  orderBody: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  orderImage: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
    margin: '0 0 4px',
  },
  orderType: {
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.06)',
    padding: '1px 8px',
    borderRadius: '4px',
  },
  orderAmount: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  orderActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  payBtn: {
    padding: '6px 16px',
    fontSize: '13px',
    color: '#fff',
    backgroundColor: '#E74C3C',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  detailBtn: {
    padding: '6px 16px',
    fontSize: '13px',
    color: '#666',
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  favGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  favCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
  },
  favImageWrap: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  favImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  favInfo: {
    flex: 1,
  },
  favType: {
    fontSize: '11px',
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(31,95,168,0.06)',
    padding: '1px 8px',
    borderRadius: '4px',
  },
  favTitle: {
    fontSize: '14px',
    color: '#333',
    margin: '4px 0',
    fontWeight: 500,
  },
  favPrice: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E74C3C',
  },
  viewLink: {
    fontSize: '13px',
    color: 'var(--primary-color)',
    textDecoration: 'none',
    padding: '6px 12px',
    border: '1px solid var(--primary-color)',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  },
  settingsWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  settingLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: 500,
  },
  settingValue: {
    fontSize: '14px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  changeBtn: {
    fontSize: '12px',
    color: 'var(--primary-color)',
    backgroundColor: 'transparent',
    border: '1px solid var(--primary-color)',
    borderRadius: '4px',
    padding: '2px 10px',
    cursor: 'pointer',
  },
};
