import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Select, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getRoomTypeList, createRoomType, updateRoomType, deleteRoomType, getHotelList } from '../../api'

function RoomTypeManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [hotels, setHotels] = useState([])
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增房型')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRoomTypes()
    fetchHotelOptions()
  }, [pagination.current, pagination.pageSize])

  // 获取房型列表
  const fetchRoomTypes = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getRoomTypeList(params)
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

  // 获取民宿列表（用于选择框）
  const fetchHotelOptions = async () => {
    try {
      const res = await getHotelList({ page: 1, pageSize: 999 })
      const list = res.data?.list || res.data?.records || res.data || []
      setHotels(list)
    } catch {
      // 忽略
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增房型')
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑房型')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateRoomType(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createRoomType(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchRoomTypes()
    } catch (err) {
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除房型「${record.name}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRoomType(record.id)
          message.success('删除成功')
          fetchRoomTypes()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '房型名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '所属民宿', dataIndex: 'hotelName', key: 'hotelName', width: 150, render: (text, r) => text || r.hotel || '-' },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (url) =>
        url ? <img src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    {
      title: '价格/晚',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (val) => (val ? `¥${Number(val).toFixed(2)}` : '-'),
    },
    { title: '可住人数', dataIndex: 'capacity', key: 'capacity', width: 80, render: (val) => (val ? `${val}人` : '-') },
    { title: '床型', dataIndex: 'bedType', key: 'bedType', width: 100, render: (text) => text || '-' },
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
        <h2>房型管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增房型
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchRoomTypes} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无房型数据" />
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
          <Form.Item name="hotelId" label="所属民宿" rules={[{ required: true, message: '请选择民宿' }]}>
            <Select placeholder="请选择民宿" allowClear>
              {hotels.map((h) => (
                <Select.Option key={h.id} value={h.id}>{h.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="房型名称" rules={[{ required: true, message: '请输入房型名称' }]}>
            <Input placeholder="例：豪华大床房、标准双床房" />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="price" label="价格/晚" rules={[{ required: true, message: '请输入价格' }]}>
              <InputNumber min={0} step={0.01} prefix="¥" placeholder="价格" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="capacity" label="可住人数">
              <InputNumber min={1} placeholder="人数" style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="bedType" label="床型">
            <Input placeholder="例：1.8m大床、1.5m双床" />
          </Form.Item>
          <Form.Item name="image" label="图片URL">
            <Input placeholder="请输入房型图片URL" />
          </Form.Item>
          <Form.Item name="description" label="房型描述">
            <Input.TextArea rows={3} placeholder="请输入房型描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoomTypeManage
