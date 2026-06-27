import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Select, Switch, Tag, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { getProductList, createProduct, updateProduct, deleteProduct, toggleProductStatus, getCategoryList } from '../../api'

function ProductManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categories, setCategories] = useState([])
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增商品')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchProducts()
    fetchCategoryOptions()
  }, [pagination.current, pagination.pageSize])

  // 获取商品列表
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
      }
      const res = await getProductList(params)
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

  // 获取分类选项
  const fetchCategoryOptions = async () => {
    try {
      const res = await getCategoryList({ page: 1, pageSize: 999 })
      const list = res.data?.list || res.data?.records || res.data || []
      setCategories(list)
    } catch {
      // 忽略
    }
  }

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    fetchProducts()
  }

  // 打开新增
  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增商品')
    form.resetFields()
    setModalOpen(true)
  }

  // 打开编辑
  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑商品')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateProduct(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createProduct(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchProducts()
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
      content: `确定要删除商品「${record.name}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteProduct(record.id)
          message.success('删除成功')
          fetchProducts()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  // 上下架切换
  const handleToggleStatus = async (record, checked) => {
    const label = checked ? '上架' : '下架'
    try {
      await toggleProductStatus(record.id, checked ? 'on' : 'off')
      message.success(`${label}成功`)
      fetchProducts()
    } catch {
      // 已在拦截器处理
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (url) =>
        url ? <img src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : '-',
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
      render: (text, r) => text || r.category || '-',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (val) => (val ? `¥${Number(val).toFixed(2)}` : '-'),
    },
    { title: '库存', dataIndex: 'stock', key: 'stock', width: 80, render: (val) => val ?? '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => {
        const isOn = status === 'on' || status === 'online' || status === 1
        return (
          <Space>
            <Tag color={isOn ? 'success' : 'default'}>{isOn ? '已上架' : '已下架'}</Tag>
            <Switch
              size="small"
              checked={isOn}
              onChange={(checked) => handleToggleStatus(record, checked)}
            />
          </Space>
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
        <h2>商品管理</h2>
      </div>

      <div className="search-bar">
        <Input
          placeholder="搜索商品名称"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 220 }}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增商品
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchProducts}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无商品数据" />
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
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item name="categoryId" label="所属分类">
            <Select placeholder="请选择分类" allowClear>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space size="middle">
            <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
              <InputNumber min={0} step={0.01} prefix="¥" placeholder="价格" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存' }]}>
              <InputNumber min={0} step={1} placeholder="库存数量" style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="image" label="图片URL">
            <Input placeholder="请输入商品图片URL" />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <Input.TextArea rows={3} placeholder="请输入商品描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductManage
