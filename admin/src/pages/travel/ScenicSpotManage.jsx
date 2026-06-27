import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getScenicSpotList, createScenicSpot, updateScenicSpot, deleteScenicSpot } from '../../api'

function ScenicSpotManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增景区')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchSpots()
  }, [pagination.current, pagination.pageSize])

  // 获取景区列表
  const fetchSpots = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getScenicSpotList(params)
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

  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增景区')
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑景区')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateScenicSpot(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createScenicSpot(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchSpots()
    } catch (err) {
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除景区「${record.name}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteScenicSpot(record.id)
          message.success('删除成功')
          fetchSpots()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '景区名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    {
      title: '封面图',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (url) =>
        url ? <img src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    { title: '所在城市', dataIndex: 'city', key: 'city', width: 100, render: (text) => text || '-' },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (text) => text || '-',
    },
    {
      title: '门票价格',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      width: 100,
      render: (val) => (val ? `¥${Number(val).toFixed(2)}` : '-'),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (val) => (val ? `${val}分` : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h2>景区管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增景区
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchSpots} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无景区数据" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 1000 }}
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="景区名称" rules={[{ required: true, message: '请输入景区名称' }]}>
            <Input placeholder="请输入景区名称" />
          </Form.Item>
          <Form.Item name="city" label="所在城市">
            <Input placeholder="请输入所在城市" />
          </Form.Item>
          <Form.Item name="address" label="详细地址">
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="ticketPrice" label="门票价格">
              <InputNumber min={0} step={0.01} prefix="¥" placeholder="价格" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="level" label="景区等级">
              <Input placeholder="例：5A、4A" style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="image" label="封面图URL">
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item name="description" label="景区介绍">
            <Input.TextArea rows={3} placeholder="请输入景区介绍" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ScenicSpotManage
