import { useState, useEffect } from 'react'
import { Table, Tag, Button, Space, Modal, Input, Tabs, Image, Spin, Empty, message } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { getMerchantApplyList, approveMerchantApply, rejectMerchantApply, getMerchantQualification } from '../../api'

const { TextArea } = Input

function MerchantApplyList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [activeTab, setActiveTab] = useState('pending')
  // 驳回弹窗
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [currentApply, setCurrentApply] = useState(null)
  const [rejectLoading, setRejectLoading] = useState(false)
  // 资质查看弹窗
  const [qualModalOpen, setQualModalOpen] = useState(false)
  const [qualData, setQualData] = useState(null)
  const [qualLoading, setQualLoading] = useState(false)

  useEffect(() => {
    fetchApplies()
  }, [pagination.current, pagination.pageSize, activeTab])

  // 获取申请列表
  const fetchApplies = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        status: activeTab,
      }
      const res = await getMerchantApplyList(params)
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

  // Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 查看资质材料
  const handleViewQualification = async (record) => {
    setCurrentApply(record)
    setQualModalOpen(true)
    setQualLoading(true)
    try {
      const res = await getMerchantQualification(record.id)
      setQualData(res.data || res)
    } catch {
      // 已在拦截器处理
    } finally {
      setQualLoading(false)
    }
  }

  // 通过申请
  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认通过',
      content: `确定要通过「${record.shopName || record.name}」的入驻申请吗？`,
      okText: '确定通过',
      cancelText: '取消',
      onOk: async () => {
        try {
          await approveMerchantApply(record.id)
          message.success('已通过该入驻申请')
          fetchApplies()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  // 打开驳回弹窗
  const handleOpenReject = (record) => {
    setCurrentApply(record)
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
      await rejectMerchantApply(currentApply.id, rejectReason)
      message.success('已驳回该入驻申请')
      setRejectModalOpen(false)
      setRejectReason('')
      fetchApplies()
    } catch {
      // 已在拦截器处理
    } finally {
      setRejectLoading(false)
    }
  }

  // Tab页签配置
  const tabItems = [
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已驳回' },
  ]

  // 状态映射
  const statusMap = {
    pending: { color: 'processing', text: '待审核' },
    approved: { color: 'success', text: '已通过' },
    rejected: { color: 'error', text: '已驳回' },
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: 150, render: (text, r) => text || r.name || '-' },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName', width: 100, render: (text, r) => text || r.contact || '-' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130, render: (text, r) => text || r.phone || '-' },
    { title: '经营类目', dataIndex: 'category', key: 'category', width: 120, render: (text) => text || '-' },
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
      title: '申请时间',
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewQualification(record)}>
            查看资质
          </Button>
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
        <h2>商家入驻审核</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} style={{ marginBottom: 16 }} />

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无申请数据" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 1200 }}
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
        title="驳回申请"
        open={rejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => setRejectModalOpen(false)}
        confirmLoading={rejectLoading}
        okText="确认驳回"
        cancelText="取消"
      >
        <div style={{ marginBottom: 8 }}>
          商家：{currentApply?.shopName || currentApply?.name || '-'}
        </div>
        <TextArea
          rows={4}
          placeholder="请输入驳回原因"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* 资质查看弹窗 */}
      <Modal
        title="商家资质材料"
        open={qualModalOpen}
        onCancel={() => setQualModalOpen(false)}
        footer={null}
        width={600}
      >
        <Spin spinning={qualLoading}>
          {qualData ? (
            <div>
              <p><strong>店铺名称：</strong>{qualData.shopName || qualData.name || currentApply?.shopName || '-'}</p>
              <p><strong>联系人：</strong>{qualData.contactName || qualData.contact || '-'}</p>
              <p><strong>联系电话：</strong>{qualData.contactPhone || qualData.phone || '-'}</p>
              <p><strong>经营类目：</strong>{qualData.category || '-'}</p>
              <p><strong>店铺地址：</strong>{qualData.address || '-'}</p>
              <p><strong>营业执照：</strong></p>
              {qualData.businessLicense ? (
                <Image src={qualData.businessLicense} style={{ maxWidth: '100%', maxHeight: 300 }} />
              ) : (
                <span style={{ color: '#ccc' }}>无</span>
              )}
              <p style={{ marginTop: 16 }}><strong>其他资质：</strong></p>
              {qualData.qualifications ? (
                <Image src={qualData.qualifications} style={{ maxWidth: '100%', maxHeight: 300 }} />
              ) : (
                <span style={{ color: '#ccc' }}>无</span>
              )}
            </div>
          ) : (
            <Empty description="暂无资质数据" />
          )}
        </Spin>
      </Modal>
    </div>
  )
}

export default MerchantApplyList
