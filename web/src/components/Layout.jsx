/**
 * 公共布局组件 - 导航栏 + 内容区 + 底部
 */

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Layout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      try {
        const info = JSON.parse(userInfo);
        setIsLoggedIn(true);
        setUserName(info.name || info.nickname || '用户');
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      {/* 顶部导航栏 */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>乌</span>
            <span style={styles.logoText}>乌东文旅</span>
          </Link>

          {/* 导航菜单 */}
          <nav style={styles.nav}>
            <Link to="/clothing" style={styles.navLink}>衣</Link>
            <Link to="/food" style={styles.navLink}>食</Link>
            <Link to="/hotel" style={styles.navLink}>住</Link>
            <Link to="/travel" style={styles.navLink}>行</Link>
            <Link to="/community" style={styles.navLink}>社区</Link>
          </nav>

          {/* 搜索框 */}
          <SearchBar style={{ marginLeft: 'auto', marginRight: '20px' }} />

          {/* 用户操作 */}
          <div style={styles.userArea}>
            {isLoggedIn ? (
              <>
                <Link to="/cart" style={styles.actionLink}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <span>购物车</span>
                </Link>
                <Link to="/profile" style={styles.actionLink}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{userName}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>退出</button>
              </>
            ) : (
              <Link to="/login" style={styles.loginBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>登录</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>

      {/* 底部版权 */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerCols}>
            <div style={styles.footerCol}>
              <h4>关于乌东文旅</h4>
              <p>乌东文旅致力于推广乌东地区非物质文化遗产、特色美食、乡村民宿与生态旅游，为游客提供一站式文旅服务。</p>
            </div>
            <div style={styles.footerCol}>
              <h4>快速链接</h4>
              <Link to="/clothing" style={styles.footerLink}>非遗商品</Link>
              <Link to="/food" style={styles.footerLink}>餐饮美食</Link>
              <Link to="/hotel" style={styles.footerLink}>住宿预订</Link>
              <Link to="/travel" style={styles.footerLink}>线路订票</Link>
              <Link to="/community" style={styles.footerLink}>社区分享</Link>
            </div>
            <div style={styles.footerCol}>
              <h4>联系我们</h4>
              <p>客服电话：400-123-4567</p>
              <p>邮箱：service@wudongtravel.com</p>
              <p>地址：乌东县古镇文旅服务中心</p>
            </div>
          </div>
          <div style={styles.copyright}>
            © 2025 乌东文旅 WudongCulturalTravel. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginRight: '30px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 700,
    marginRight: '8px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--primary-color)',
  },
  nav: {
    display: 'flex',
    gap: '4px',
  },
  navLink: {
    padding: '8px 16px',
    fontSize: '15px',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s',
    fontWeight: 500,
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  actionLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#666',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    textDecoration: 'none',
    padding: '6px 16px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: 'transparent',
    border: '1px solid #d9d9d9',
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  footer: {
    backgroundColor: '#2c2c2c',
    color: '#ccc',
    marginTop: '60px',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 20px',
  },
  footerCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '30px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerLink: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '13px',
  },
  copyright: {
    borderTop: '1px solid #444',
    paddingTop: '20px',
    fontSize: '12px',
    color: '#888',
    textAlign: 'center',
  },
};
