import { useState, useEffect } from 'react'
import { Card, Col, Row, Statistic, Spin, Empty, Alert } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  DollarOutlined,
  FileTextOutlined,
  AuditOutlined,
} from '@ant-design/icons'
import { getDashboard } from '../api'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  // 获取看板数据
  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDashboard()
      setData(res.data || res)
    } catch (err) {
      setError(err.message || '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载中状态
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <Alert
        type="error"
        message="加载失败"
        description={error}
        showIcon
        action={
          <a onClick={fetchDashboard} style={{ cursor: 'pointer' }}>
            重试
          </a>
        }
      />
    )
  }

  // 空数据
  if (!data) {
    return <Empty description="暂无数据" />
  }

  // 统计卡片配置 - 后端返回 snake_case 字段名
  const d = data || {}
  const stats = [
    {
      title: '用户总数',
      value: d.user_count ?? d.totalUsers ?? d.userCount ?? 0,
      icon: <UserOutlined style={{ fontSize: 32, color: '#1F5FA8' }} />,
      color: '#E6F0FA',
    },
    {
      title: '订单总数',
      value: d.order_count ?? d.totalOrders ?? d.orderCount ?? 0,
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#52C41A' }} />,
      color: '#F0FBE6',
    },
    {
      title: '商户数',
      value: d.merchant_count ?? d.totalMerchants ?? d.merchantCount ?? 0,
      icon: <ShopOutlined style={{ fontSize: 32, color: '#FA8C16' }} />,
      color: '#FFF7E6',
    },
    {
      title: 'GMV (元)',
      value: d.total_gmv ?? d.gmv ?? d.totalGMV ?? 0,
      icon: <DollarOutlined style={{ fontSize: 32, color: '#F5222D' }} />,
      color: '#FFF1F0',
      prefix: '¥',
      precision: 2,
    },
    {
      title: '待审核游记',
      value: d.pending_notes ?? d.pendingNotes ?? d.pendingNoteCount ?? 0,
      icon: <FileTextOutlined style={{ fontSize: 32, color: '#722ED1' }} />,
      color: '#F9F0FF',
    },
    {
      title: '待审核商家',
      value: d.pending_applies ?? d.pendingMerchants ?? d.pendingMerchantCount ?? 0,
      icon: <AuditOutlined style={{ fontSize: 32, color: '#13C2C2' }} />,
      color: '#E6FFFB',
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>数据看板</h2>
      </div>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                precision={stat.precision}
                valueStyle={{ fontSize: 28, fontWeight: 'bold', color: '#1F5FA8' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Dashboard
