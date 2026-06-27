import { useState, useEffect } from 'react'
import { Table, Input, Button, Space, Tag, Modal, message, Spin, Empty } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { getUserList, toggleUserBan } from '../../api'

function UserList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [pagination.current, pagination.pageSize])

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
      }
      const res = await getUserList(params)
      const list = res.data?.list || res.data?.records || res.data || []
      const total = res.data?.total || res.total || list.length
      setData(list)
      setPagination((prev) => ({ ...prev, total }))
    } catch {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false)
    }
  }

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    fetchUsers()
  }

  // 重置
  const handleReset = () => {
    setSearchKeyword('')
    setPagination((prev) => ({ ...prev, current: 1 }))
    // 重置后重新获取
    setTimeout(() => fetchUsers(), 0)
  }

  // 封禁/解封操作
  const handleToggleBan = (record) => {
    const action = record.banned ? '解封' : '封禁'
    Modal.confirm({
      title: `确认${action}`,
      content: `确定要${action}用户「${record.nickname || record.username}」吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await toggleUserBan(record.id, !record.banned)
          message.success(`${action}成功`)
          fetchUsers()
        } catch {
          // 错误已在拦截器中处理
        }
      },
    })
  }

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (url) =>
        url ? (
          <img src={url} alt="头像" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#ccc' }}>无</span>
        ),
    },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'banned',
      key: 'banned',
      width: 80,
      render: (banned) => (banned ? <Tag color="error">已封禁</Tag> : <Tag color="success">正常</Tag>),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          danger={!record.banned}
          onClick={() => handleToggleBan(record)}
        >
          {record.banned ? '解封' : '封禁'}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>用户管理</h2>
      </div>

      {/* 搜索区域 */}
      <div className="search-bar">
        <Input
          placeholder="搜索用户名/昵称/手机号"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 260 }}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      </div>

      {/* 表格 */}
      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无用户数据" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 1100 }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize, total: pagination.total }),
            }}
          />
        )}
      </Spin>
    </div>
  )
}

export default UserList
