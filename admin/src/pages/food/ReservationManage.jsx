import { useState, useEffect } from 'react'
import { Table, Tag, Select, Spin, Empty, message } from 'antd'
import { getReservationList, updateReservationStatus } from '../../api'

function ReservationManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    fetchReservations()
  }, [pagination.current, pagination.pageSize])

  // 获取预订列表
  const fetchReservations = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getReservationList(params)
      const list = res.data?.list || res.data?.records || res.data || []
      const total = res.data?.total || res.total || list.length
      setData(list)
      setPagination((prev) => ({ ...prev, total }))
    } catch {
      // 已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  // 切换预订状态
  const handleStatusChange = async (record, newStatus) => {
    try {
      await updateReservationStatus(record.id, newStatus)
      message.success('状态更新成功')
      fetchReservations()
    } catch {
      // 已在拦截器处理
    }
  }

  // 状态配置
  const statusConfig = {
    reserved: { color: 'processing', text: '已预订' },
    arrived: { color: 'success', text: '已到店' },
    cancelled: { color: 'default', text: '已取消' },
    completed: { color: 'success', text: '已完成' },
  }

  const statusOptions = [
    { value: 'reserved', label: '已预订' },
    { value: 'arrived', label: '已到店' },
    { value: 'cancelled', label: '已取消' },
    { value: 'completed', label: '已完成' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '餐厅名称', dataIndex: 'restaurantName', key: 'restaurantName', width: 150, render: (text, r) => text || r.restaurant || '-' },
    { title: '预订人', dataIndex: 'userName', key: 'userName', width: 100, render: (text, r) => text || r.user || '-' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (text) => text || '-' },
    {
      title: '用餐人数',
      dataIndex: 'guestCount',
      key: 'guestCount',
      width: 80,
      render: (val) => (val ? `${val}人` : '-'),
    },
    {
      title: '预订时间',
      dataIndex: 'reserveTime',
      key: 'reserveTime',
      width: 160,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (status, record) => {
        const cfg = statusConfig[status] || { color: 'default', text: status || '未知' }
        return (
          <Select
            value={status}
            size="small"
            style={{ width: 110 }}
            onChange={(val) => handleStatusChange(record, val)}
            options={statusOptions}
          >
          </Select>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>餐位预订管理</h2>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无预订记录" />
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

export default ReservationManage
