import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Input, Form, Spin, Empty, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '../api'

function NoticeManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增公告')
  const [editingRecord, setEditingRecord] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchNotices()
  }, [pagination.current, pagination.pageSize])

  // 获取公告列表
  const fetchNotices = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, pageSize: pagination.pageSize }
      const res = await getNoticeList(params)
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
    setModalTitle('新增公告')
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setModalTitle('编辑公告')
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      if (editingRecord) {
        await updateNotice(editingRecord.id, values)
        message.success('更新成功')
      } else {
        await createNotice(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      form.resetFields()
      fetchNotices()
    } catch (err) {
      if (err.errorFields) return
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除公告「${record.title}」吗？`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteNotice(record.id)
          message.success('删除成功')
          fetchNotices()
        } catch {
          // 已在拦截器处理
        }
      },
    })
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '公告标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    {
      title: '内容概要',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text) => (text ? (text.length > 50 ? text.substring(0, 50) + '...' : text) : '-'),
    },
    {
      title: '发布人',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 100,
      render: (text, r) => text || r.publisherName || '-',
    },
    {
      title: '发布时间',
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
        <h2>公告管理</h2>
      </div>

      <div className="action-bar">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增公告
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchNotices} style={{ marginLeft: 8 }}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无公告数据" />
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
          <Form.Item name="title" label="公告标题" rules={[{ required: true, message: '请输入公告标题' }]}>
            <Input placeholder="请输入公告标题" />
          </Form.Item>
          <Form.Item name="content" label="公告内容" rules={[{ required: true, message: '请输入公告内容' }]}>
            <Input.TextArea rows={6} placeholder="请输入公告内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NoticeManage
