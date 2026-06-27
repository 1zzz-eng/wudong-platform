import { useState, useEffect } from 'react'
import { Table, Tag, Button, Space, Modal, Input, Tabs, Spin, Empty, message } from 'antd'
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons'
import { getNoteReviewList, approveNote, rejectNote } from '../../api'

const { TextArea } = Input

function NoteReviewList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [activeTab, setActiveTab] = useState('pending')
  // 驳回弹窗
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [currentNote, setCurrentNote] = useState(null)
  const [rejectLoading, setRejectLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [pagination.current, pagination.pageSize, activeTab])

  // 获取游记列表
  const fetchNotes = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        status: activeTab,
      }
      const res = await getNoteReviewList(params)
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

  const handleTabChange = (key) => {
    setActiveTab(key)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 通过游记
  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认通过',
      content: `确定要通过游记「${record.title || '无标题'}」吗？`,
      okText: '确定通过',
      cancelText: '取消',
      onOk: async () => {
        try {
          await approveNote(record.id)
          message.success('审核通过')
          fetchNotes()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  // 打开驳回弹窗
  const handleOpenReject = (record) => {
    setCurrentNote(record)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  // 确认驳回
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请填写驳回原因')
      return
    }
    setRejectLoading(true)
    try {
      await rejectNote(currentNote.id, rejectReason)
      message.success('已驳回该游记')
      setRejectModalOpen(false)
      setRejectReason('')
      fetchNotes()
    } catch {
      // 已在拦截器处理
    } finally {
      setRejectLoading(false)
    }
  }

  const tabItems = [
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已驳回' },
  ]

  const statusMap = {
    pending: { color: 'processing', text: '待审核' },
    approved: { color: 'success', text: '已通过' },
    rejected: { color: 'error', text: '已驳回' },
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '游记标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: '作者', dataIndex: 'authorName', key: 'authorName', width: 100, render: (text, r) => text || r.author || '-' },
    { title: '目的地', dataIndex: 'destination', key: 'destination', width: 120, render: (text) => text || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const s = statusMap[status] || { color: 'default', text: status }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      key: 'rejectReason',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} style={{ color: '#52C41A' }} onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="link" icon={<CloseOutlined />} danger onClick={() => handleOpenReject(record)}>
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>游记审核</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} style={{ marginBottom: 16 }} />

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无游记数据" />
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

      {/* 驳回弹窗 */}
      <Modal
        title="驳回游记"
        open={rejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => setRejectModalOpen(false)}
        confirmLoading={rejectLoading}
        okText="确认驳回"
        cancelText="取消"
      >
        <div style={{ marginBottom: 8 }}>
          游记：{currentNote?.title || '无标题'}
        </div>
        <TextArea
          rows={4}
          placeholder="请输入驳回原因"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default NoteReviewList
