import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, Select, Tag, Spin, Empty, message } from 'antd'
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { getReportList, handleReport } from '../api'

// ---------- 常量映射 ----------

/** 目标类型中文映射 */
const TARGET_TYPE_MAP = {
  note: '游记',
  comment: '评论',
  product: '商品',
  shop: '店铺',
  user: '用户',
  merchant: '商家',
}

/** 举报状态颜色与文案映射 */
const STATUS_CONFIG = {
  pending: { color: 'orange', text: '待处理' },
  handled: { color: 'green', text: '已处理' },
  rejected: { color: 'default', text: '已驳回' },
}

function ReportManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  // 状态筛选值
  const [statusFilter, setStatusFilter] = useState(undefined)

  // 处理弹窗状态
  const [handleOpen, setHandleOpen] = useState(false)
  const [handlingRecord, setHandlingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  // 分页或筛选条件变化时重新请求
  useEffect(() => {
    fetchReports()
  }, [pagination.current, pagination.pageSize, statusFilter])

  /** 获取举报列表 */
  const fetchReports = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
      // 附加状态筛选参数
      if (statusFilter) {
        params.status = statusFilter
      }
      const res = await getReportList(params)
      // 适配多种后端返回格式
      const list = res.data?.list || res.data?.records || res.data || []
      const total = res.data?.total || res.total || list.length
      setData(list)
      setPagination((prev) => ({ ...prev, total }))
    } catch {
      // 错误已在请求拦截器中统一提示
    } finally {
      setLoading(false)
    }
  }

  /** 打开处理弹窗 */
  const handleOpenModal = (record) => {
    setHandlingRecord(record)
    form.resetFields()
    setHandleOpen(true)
  }

  /** 提交处理结果 */
  const handleSubmitReport = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      await handleReport(handlingRecord.id, values)
      message.success('处理成功')
      setHandleOpen(false)
      form.resetFields()
      fetchReports()
    } catch (err) {
      // errorFields 表示表单验证失败，不需要额外处理
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  // ---------- 表格列定义 ----------
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 65, align: 'center' },
    {
      title: '举报人ID',
      dataIndex: 'reporterId',
      key: 'reporterId',
      width: 100,
      align: 'center',
      render: (text, record) => text || record.reporterName || record.reporter?.id || '-',
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      key: 'targetType',
      width: 100,
      align: 'center',
      render: (type) => (
        <Tag>{TARGET_TYPE_MAP[type] || type || '-'}</Tag>
      ),
    },
    {
      title: '目标ID',
      dataIndex: 'targetId',
      key: 'targetId',
      width: 100,
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: '举报原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 230,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '举报时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (status) => {
        const config = STATUS_CONFIG[status] || { color: 'default', text: status || '-' }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        const result = text || record.remark || record.handleRemark
        return result || '-'
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        // 只有待处理的举报才显示处理按钮
        record.status === 'pending' ? (
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            处理
          </Button>
        ) : (
          <span style={{ color: '#999' }}>已处理</span>
        ),
    },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <div className="page-header">
        <h2>举报处理</h2>
      </div>

      {/* 操作按钮栏 + 状态筛选 */}
      <div className="action-bar" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Button icon={<ReloadOutlined />} onClick={fetchReports}>
          刷新
        </Button>

        {/* 状态筛选下拉框 */}
        <Select
          placeholder="按状态筛选"
          allowClear
          style={{ width: 140 }}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val)
            // 切换筛选条件时重置到第一页
            setPagination((prev) => ({ ...prev, current: 1 }))
          }}
          options={[
            { label: '待处理', value: 'pending' },
            { label: '已处理', value: 'handled' },
            { label: '已驳回', value: 'rejected' },
          ]}
        />
      </div>

      {/* 表格区域 */}
      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无举报数据" />
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
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize, total: pagination.total }),
            }}
          />
        )}
      </Spin>

      {/* 处理举报弹窗 */}
      <Modal
        title="处理举报"
        open={handleOpen}
        onOk={handleSubmitReport}
        onCancel={() => setHandleOpen(false)}
        confirmLoading={confirmLoading}
        okText="提交处理"
        cancelText="取消"
        width={540}
        destroyOnClose
      >
        {/* 被举报信息概览卡片 */}
        {handlingRecord && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: '#fafafa',
              borderRadius: 6,
              border: '1px solid #f0f0f0',
              fontSize: 13,
              lineHeight: 2.2,
            }}
          >
            <div>
              <strong>举报ID：</strong>
              {handlingRecord.id}
            </div>
            <div>
              <strong>目标类型：</strong>
              <Tag style={{ marginLeft: 4 }}>
                {TARGET_TYPE_MAP[handlingRecord.targetType] || handlingRecord.targetType || '-'}
              </Tag>
            </div>
            <div>
              <strong>目标ID：</strong>
              {handlingRecord.targetId || '-'}
            </div>
            <div>
              <strong>举报原因：</strong>
              {handlingRecord.reason || '-'}
            </div>
          </div>
        )}

        {/* 处理表单 */}
        <Form form={form} layout="vertical">
          <Form.Item
            name="result"
            label="处理结论"
            rules={[{ required: true, message: '请选择处理结论' }]}
          >
            <Select
              placeholder="请选择处理结论"
              options={[
                { label: '已处理（内容已违规，已下架/删除）', value: 'handled' },
                { label: '驳回举报（内容无违规）', value: 'rejected' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="remark"
            label="处理备注"
            rules={[{ required: true, message: '请填写处理备注' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请填写处理说明，如违规原因、处理措施等"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ReportManage
