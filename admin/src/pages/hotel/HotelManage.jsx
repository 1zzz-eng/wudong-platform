import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getHotelList, createHotel, updateHotel, deleteHotel } from '../../api'

function HotelManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增民宿')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchHotels()
  }, [pagination.current, pagination.pageSize])

  // 获取民宿列表
  const fetchHotels = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getHotelList(params)
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
    setModalTitle('新增民宿')
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑民宿')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateHotel(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createHotel(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchHotels()
    } catch (err) {
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除民宿「${record.name}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteHotel(record.id)
          message.success('删除成功')
          fetchHotels()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '民宿名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    {
      title: '封面图',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (url) =>
        url ? <img src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    { title: '地址', dataIndex: 'address', key: 'address', width: 200, ellipsis: true, render: (text) => text || '-' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (text) => text || '-' },
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
        <h2>民宿管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增民宿
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchHotels} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无民宿数据" />
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
          <Form.Item name="name" label="民宿名称" rules={[{ required: true, message: '请输入民宿名称' }]}>
            <Input placeholder="请输入民宿名称" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入民宿地址" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="rating" label="评分">
              <InputNumber min={0} max={5} step={0.1} placeholder="评分" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="minPrice" label="最低房价">
              <InputNumber min={0} prefix="¥" placeholder="最低价" style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="image" label="封面图URL">
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item name="description" label="民宿描述">
            <Input.TextArea rows={3} placeholder="请输入民宿描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default HotelManage
