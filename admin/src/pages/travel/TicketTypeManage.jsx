import { useState, useEffect } from 'react'
import { Table, Button, InputNumber, Select, Space, Spin, Empty, message } from 'antd'
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { getTicketTypeList, updateTicketStock, getScenicSpotList } from '../../api'

function TicketTypeManage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [spots, setSpots] = useState([])
  const [selectedSpotId, setSelectedSpotId] = useState(undefined)
  // 保存状态
  const [saving, setSaving] = useState(false)
  const [editingCells, setEditingCells] = useState({})

  useEffect(() => {
    fetchSpotOptions()
    fetchTicketTypes()
  }, [pagination.current, pagination.pageSize])

  // 获取景区列表
  const fetchSpotOptions = async () => {
    try {
      const res = await getScenicSpotList({ page: 1, pageSize: 999 })
      const list = res.data?.list || res.data?.records || res.data || []
      setSpots(list)
    } catch {
      // 忽略
    }
  }

  // 获取票种列表
  const fetchTicketTypes = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        spotId: selectedSpotId,
      }
      const res = await getTicketTypeList(params)
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

  // 单元格值变更
  const handleCellChange = (record, field, value) => {
    const key = `${record.id}-${field}`
    setEditingCells((prev) => ({ ...prev, [key]: value }))
    setData((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, [field]: value } : item)),
    )
  }

  // 保存库存修改
  const handleSave = async () => {
    const changedItems = data.map((item) => ({
      id: item.id,
      totalStock: editingCells[`${item.id}-totalStock`] ?? item.totalStock,
      price: editingCells[`${item.id}-price`] ?? item.price,
    }))
    if (Object.keys(editingCells).length === 0) {
      message.info('没有需要保存的修改')
      return
    }
    setSaving(true)
    try {
      await updateTicketStock({ items: changedItems })
      message.success('保存成功')
      setEditingCells({})
      fetchTicketTypes()
    } catch {
      // 已在拦截器处理
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '票种名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '所属景区', dataIndex: 'spotName', key: 'spotName', width: 130, render: (text) => text || '-' },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (val, record) => (
        <InputNumber
          size="small"
          min={0}
          step={0.01}
          prefix="¥"
          value={editingCells[`${record.id}-price`] ?? val}
          onChange={(v) => handleCellChange(record, 'price', v)}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: '可售数量',
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 140,
      render: (val, record) => (
        <InputNumber
          size="small"
          min={0}
          value={editingCells[`${record.id}-totalStock`] ?? val}
          onChange={(v) => handleCellChange(record, 'totalStock', v)}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: '已售',
      dataIndex: 'sold',
      key: 'sold',
      width: 80,
      render: (val) => val ?? 0,
    },
    {
      title: '剩余',
      dataIndex: 'available',
      key: 'available',
      width: 80,
      render: (_, record) => {
        const total = editingCells[`${record.id}-totalStock`] ?? record.totalStock ?? 0
        const sold = record.sold ?? 0
        return total - sold
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val) => (val === 'on' || val === 1 ? '在售' : val === 'off' || val === 0 ? '停售' : val || '-'),
    },
  ]

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>票种库存管理</h2>
        <Space>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
            保存修改
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchTicketTypes}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 筛选 */}
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Select
          placeholder="选择景区"
          allowClear
          value={selectedSpotId}
          onChange={(val) => {
            setSelectedSpotId(val)
            setPagination((prev) => ({ ...prev, current: 1 }))
          }}
          style={{ width: 200 }}
        >
          {spots.map((s) => (
            <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={() => { setPagination((prev) => ({ ...prev, current: 1 })); fetchTicketTypes() }}>
          查询
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无票种数据" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 900 }}
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
    </div>
  )
}

export default TicketTypeManage
