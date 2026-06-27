import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Tabs, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { adminLogin, merchantLogin } from '../api'

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 登录处理
  const handleLogin = async (values) => {
    setLoading(true)
    try {
      const { username, password } = values
      const res = await adminLogin({ username, password })
      // 存储 token 和管理员信息
      localStorage.setItem('admin_token', res.data?.token || res.token)
      localStorage.setItem('admin_info', JSON.stringify(res.data?.admin || res.data || { username }))
      message.success('登录成功')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      message.error(err.response?.data?.message || err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 商家登录处理
  const handleMerchantLogin = async (values) => {
    setLoading(true)
    try {
      const { username, password } = values
      const res = await merchantLogin({ username, password })
      localStorage.setItem('merchant_token', res.data?.token || res.token)
      localStorage.setItem('merchant_info', JSON.stringify(res.data?.merchant || res.data || { username }))
      message.success('商家登录成功')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      message.error(err.response?.data?.message || err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // Tab 页签切换
  const tabItems = [
    {
      key: 'admin',
      label: '管理员登录',
      children: (
        <Form name="admin-login" onFinish={handleLogin} size="large" autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入管理员账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="管理员账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#1F5FA8' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'merchant',
      label: '商家登录',
      children: (
        <Form name="merchant-login" onFinish={handleMerchantLogin} size="large" autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入商家账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="商家账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#1F5FA8' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-title">武咚平台管理后台</div>
        <Tabs defaultActiveKey="admin" centered items={tabItems} />
      </div>
    </div>
  )
}

export default Login
