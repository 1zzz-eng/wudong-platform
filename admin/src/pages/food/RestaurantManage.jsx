import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Spin, Empty, message, Upload } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons'
import { getRestaurantList, createRestaurant, updateRestaurant, deleteRestaurant } from '../../api'

function RestaurantManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增餐厅')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRestaurants()
  }, [pagination.current, pagination.pageSize])

  // 获取餐厅列表
  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getRestaurantList(params)
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

  // 打开新增
  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增餐厅')
    form.resetFields()
    setModalOpen(true)
  }

  // 打开编辑
  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑餐厅')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateRestaurant(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createRestaurant(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchRestaurants()
    } catch (err) {
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  // 删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除餐厅「${record.name}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRestaurant(record.id)
          message.success('删除成功')
          fetchRestaurants()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '餐厅名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    {
      title: '封面图',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (url) =>
        url ? <img src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    { title: '菜系', dataIndex: 'cuisine', key: 'cuisine', width: 100, render: (text) => text || '-' },
    { title: '地址', dataIndex: 'address', key: 'address', width: 200, ellipsis: true, render: (text) => text || '-' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (text) => text || '-' },
    {
      title: '人均消费',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 100,
      render: (val) => (val ? `¥${val}` : '-'),
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
        <h2>餐厅管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增餐厅
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchRestaurants} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无餐厅数据" />
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
          <Form.Item name="name" label="餐厅名称" rules={[{ required: true, message: '请输入餐厅名称' }]}>
            <Input placeholder="请输入餐厅名称" />
          </Form.Item>
          <Form.Item name="cuisine" label="菜系">
            <Input placeholder="例：川菜、粤菜、日料" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入餐厅地址" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="avgPrice" label="人均消费">
              <InputNumber min={0} prefix="¥" placeholder="人均" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="rating" label="评分">
              <InputNumber min={0} max={5} step={0.1} placeholder="评分" style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="image" label="封面图URL">
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item name="description" label="餐厅描述">
            <Input.TextArea rows={3} placeholder="请输入餐厅描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RestaurantManage
