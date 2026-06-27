import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, InputNumber, Switch, Tag, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getBannerList, createBanner, updateBanner, deleteBanner, toggleBannerStatus } from '../api'

function BannerManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  // 新增/编辑弹窗状态
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增Banner')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  // 分页变化时重新请求数据
  useEffect(() => {
    fetchBanners()
  }, [pagination.current, pagination.pageSize])

  /** 获取Banner列表 */
  const fetchBanners = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getBannerList(params)
      // 适配多种后端返回格式：data.list / data.records / data
      const list = res.data?.list || res.data?.records || res.data || []
      const total = res.data?.total || res.total || list.length
      setData(list)
      setPagination((prev) => ({ ...prev, total }))
    } catch {
      // 错误已在请求拦截器中统一提示，此处无需额外处理
    } finally {
      setLoading(false)
    }
  }

  /** 打开新增弹窗 */
  const handleAdd = () => {
    setEditingRecord(null)
    setModalTitle('新增Banner')
    form.resetFields()
    setModalOpen(true)
  }

  /** 打开编辑弹窗 */
  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑Banner')
    // 回填表单字段
    form.setFieldsValue({
      title: record.title,
      imageUrl: record.imageUrl || record.image,
      linkUrl: record.linkUrl || record.link,
      sort: record.sort,
      status: record.status === 'active',
    })
    setModalOpen(true)
  }

  /** 提交表单：新增或更新Banner */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      // 将Switch的boolean值转换为状态字符串
      const payload = {
        ...values,
        status: values.status ? 'active' : 'inactive',
      }
      if (editingRecord) {
        await updateBanner(editingRecord.id, payload)
        message.success('更新成功')
      } else {
        await createBanner(payload)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchBanners()
    } catch (err) {
      // errorFields 存在表示表单校验失败，不提示
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  /** 切换Banner上下架状态 */
  const handleToggleStatus = async (record, checked) => {
    try {
      const newStatus = checked ? 'active' : 'inactive'
      await toggleBannerStatus(record.id, newStatus)
      message.success(checked ? '已上架' : '已下架')
      fetchBanners()
    } catch {
      // 错误已在拦截器中统一处理
    }
  }

  /** 删除Banner，需二次确认 */
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除Banner「${record.title || '无标题'}」吗？删除后不可恢复。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        try {
          await deleteBanner(record.id)
          message.success('删除成功')
          fetchBanners()
        } catch {
          // 错误已在拦截器中统一处理
        }
      },
    })
  }

  // ---------- 表格列定义 ----------
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70, align: 'center' },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 130,
      render: (url, record) => {
        const src = url || record.image
        if (!src) return <span style={{ color: '#999' }}>无图片</span>
        return (
          <img
            src={src}
            alt="banner缩略图"
            style={{ width: 100, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
          />
        )
      },
    },
    {
      title: '跳转链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
      width: 220,
      ellipsis: true,
      render: (text, record) => {
        const link = text || record.link
        return link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#1F5FA8' }}>
            {link}
          </a>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      align: 'center',
      sorter: (a, b) => (a.sort || 0) - (b.sort || 0),
      render: (val) => (val !== undefined && val !== null ? val : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (status, record) => {
        const isActive = status === 'active'
        return (
          <Space size={6}>
            <Tag color={isActive ? 'success' : 'default'}>
              {isActive ? '上架中' : '已下架'}
            </Tag>
            <Switch
              size="small"
              checked={isActive}
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
      width: 170,
      render: (val) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
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
      {/* 页面标题 */}
      <div className="page-header">
        <h2>Banner管理</h2>
      </div>

      {/* 操作按钮栏 */}
      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增Banner
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchBanners} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      {/* 表格区域 */}
      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无Banner数据" />
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
        okText="确定"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ status: true, sort: 0 }}>
          {/* 标题 */}
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入Banner标题' }]}
          >
            <Input placeholder="请输入Banner标题" maxLength={50} showCount />
          </Form.Item>

          {/* 图片URL */}
          <Form.Item
            name="imageUrl"
            label="图片URL"
            rules={[
              { required: true, message: '请输入图片URL' },
              { type: 'url', message: '请输入合法的URL地址' },
            ]}
          >
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          {/* 跳转链接 */}
          <Form.Item
            name="linkUrl"
            label="跳转链接"
            rules={[{ type: 'url', message: '请输入合法的URL地址' }]}
          >
            <Input placeholder="点击Banner跳转的目标链接（选填）" />
          </Form.Item>

          {/* 排序 */}
          <Form.Item
            name="sort"
            label="排序"
            tooltip="数值越小越靠前展示"
            rules={[{ required: true, message: '请输入排序值' }]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              max={9999}
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* 状态 Switch */}
          <Form.Item name="status" label="上架状态" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BannerManage
