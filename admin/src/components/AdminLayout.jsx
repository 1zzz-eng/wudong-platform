import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  ShopOutlined,
  HomeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  NotificationOutlined,
  PictureOutlined,
  AlertOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

// 侧边栏菜单配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '数据看板',
  },
  {
    key: 'users-group',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      { key: '/users', label: '用户列表' },
    ],
  },
  {
    key: '/merchant/apply',
    icon: <AuditOutlined />,
    label: '商家入驻审核',
  },
  {
    key: 'content-group',
    icon: <FileTextOutlined />,
    label: '内容审核',
    children: [
      { key: '/content/notes', label: '游记审核' },
    ],
  },
  {
    key: 'clothing-group',
    icon: <ShoppingOutlined />,
    label: '衣-商品管理',
    children: [
      { key: '/clothing/categories', label: '分类管理' },
      { key: '/clothing/products', label: '商品管理' },
    ],
  },
  {
    key: 'food-group',
    icon: <ShopOutlined />,
    label: '食-餐饮管理',
    children: [
      { key: '/food/restaurants', label: '餐厅管理' },
      { key: '/food/reservations', label: '预订管理' },
    ],
  },
  {
    key: 'hotel-group',
    icon: <HomeOutlined />,
    label: '住-民宿管理',
    children: [
      { key: '/hotel/manage', label: '民宿管理' },
      { key: '/hotel/rooms', label: '房型管理' },
      { key: '/hotel/calendar', label: '房态日历' },
    ],
  },
  {
    key: 'travel-group',
    icon: <EnvironmentOutlined />,
    label: '行-票务管理',
    children: [
      { key: '/travel/spots', label: '景区管理' },
      { key: '/travel/tickets', icon: <TagOutlined />, label: '票种管理' },
    ],
  },
  {
    key: '/notices',
    icon: <NotificationOutlined />,
    label: '公告管理',
  },
  {
    key: '/banners',
    icon: <PictureOutlined />,
    label: 'Banner管理',
  },
  {
    key: '/reports',
    icon: <AlertOutlined />,
    label: '举报处理',
  },
]

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // 未登录 → 跳到登录页
  const token = localStorage.getItem('admin_token') || localStorage.getItem('merchant_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 获取管理员信息
  const adminInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_info') || localStorage.getItem('merchant_info') || '{}')
    } catch {
      return {}
    }
  })()

  // 选中的菜单项（取当前路径匹配的菜单key）
  const selectedKey = '/' + location.pathname.split('/').filter(Boolean).join('/')

  // 默认展开的菜单组
  const defaultOpenKeys = menuItems
    .filter((item) => item.children && item.children.some((child) => selectedKey.startsWith(child.key)))
    .map((item) => item.key)

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    localStorage.removeItem('merchant_token')
    localStorage.removeItem('merchant_info')
    navigate('/login', { replace: true })
  }

  // 菜单点击
  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key)
    }
  }

  return (
    <Layout className="admin-layout">
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#1F5FA8',
        }}
      >
        {/* Logo区域 */}
        <div className="admin-logo">
          {collapsed ? '武咚' : '武咚平台管理后台'}
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: 'transparent', borderRight: 0 }}
        />
      </Sider>

      {/* 右侧区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'all 0.2s' }}>
        {/* 顶部Header */}
        <Header className="admin-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />
          <div className="admin-header-right">
            <Space>
              <Avatar style={{ backgroundColor: '#1F5FA8' }} icon={<UserOutlined />} />
              <span>{adminInfo.username || adminInfo.name || '管理员'}</span>
              <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} danger>
                退出登录
              </Button>
            </Space>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
