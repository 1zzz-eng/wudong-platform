import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, message, Spin, Empty } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '../../api'

function CategoryManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增分类')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchCategories()
  }, [pagination.current, pagination.pageSize])

  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getCategoryList(params)
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

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增分类')
    form.resetFields()
    setModalOpen(true)
  }

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑分类')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateCategory(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createCategory(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchCategories()
    } catch (err) {
      if (err.errorFields) return // 表单验证错误
    } finally {
      setConfirmLoading(false)
    }
  }

  // 删除分类
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类「${record.name}」吗？此操作不可撤销。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCategory(record.id)
          message.success('删除成功')
          fetchCategories()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '分类名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '分类图标', dataIndex: 'icon', key: 'icon', width: 80, render: (text) => text || '-' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, render: (text) => text ?? '-' },
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
        <h2>分类管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增分类
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchCategories} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无分类数据" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 800 }}
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
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="请输入图标名称或URL（选填）" />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <Input type="number" placeholder="数字越小越靠前（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryManage
