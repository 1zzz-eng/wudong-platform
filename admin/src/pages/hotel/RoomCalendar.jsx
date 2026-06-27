import { useState, useEffect } from 'react'
import { Table, Button, DatePicker, Select, InputNumber, Space, Spin, Empty, message } from 'antd'
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { getRoomCalendar, updateRoomCalendar, getHotelList, getRoomTypeList } from '../../api'

function RoomCalendar() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [hotels, setHotels] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  // 筛选条件
  const [selectedHotelId, setSelectedHotelId] = useState(undefined)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(undefined)
  const [selectedDate, setSelectedDate] = useState(null)
  // 保存状态
  const [saving, setSaving] = useState(false)
  const [editingCells, setEditingCells] = useState({})

  useEffect(() => {
    fetchHotelOptions()
  }, [])

  useEffect(() => {
    fetchCalendar()
  }, [pagination.current, pagination.pageSize])

  // 获取民宿列表
  const fetchHotelOptions = async () => {
    try {
      const res = await getHotelList({ page: 1, pageSize: 999 })
      const list = res.data?.list || res.data?.records || res.data || []
      setHotels(list)
    } catch {
      // 忽略
    }
  }

  // 当选中民宿变化时获取对应房型
  const handleHotelChange = async (hotelId) => {
    setSelectedHotelId(hotelId)
    setSelectedRoomTypeId(undefined)
    if (hotelId) {
      try {
        const res = await getRoomTypeList({ page: 1, pageSize: 999, hotelId })
        const list = res.data?.list || res.data?.records || res.data || []
        setRoomTypes(list)
      } catch {
        setRoomTypes([])
      }
    } else {
      setRoomTypes([])
    }
  }

  // 获取房态日历
  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        hotelId: selectedHotelId,
        roomTypeId: selectedRoomTypeId,
        date: selectedDate ? selectedDate.format('YYYY-MM-DD') : undefined,
      }
      const res = await getRoomCalendar(params)
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
    // 同时更新数据列表中的值
    setData((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, [field]: value } : item)),
    )
  }

  // 保存修改
  const handleSave = async () => {
    // 收集修改过的数据
    const changedItems = data.filter((item) => {
      Object.keys(editingCells).some((key) => key.startsWith(`${item.id}-`))
      return true
    })
    if (changedItems.length === 0) {
      message.info('没有需要保存的修改')
      return
    }
    setSaving(true)
    try {
      await updateRoomCalendar({ items: changedItems })
      message.success('保存成功')
      setEditingCells({})
      fetchCalendar()
    } catch {
      // 已在拦截器处理
    } finally {
      setSaving(false)
    }
  }

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    fetchCalendar()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '民宿', dataIndex: 'hotelName', key: 'hotelName', width: 120, render: (text) => text || '-' },
    { title: '房型', dataIndex: 'roomTypeName', key: 'roomTypeName', width: 130, render: (text) => text || '-' },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (val) => val || '-',
    },
    {
      title: '总库存',
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 120,
      render: (val, record) => (
        <InputNumber
          size="small"
          min={0}
          value={val}
          onChange={(v) => handleCellChange(record, 'totalStock', v)}
          style={{ width: 80 }}
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
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      render: (val, record) => (
        <InputNumber
          size="small"
          min={0}
          step={0.01}
          prefix="¥"
          value={val}
          onChange={(v) => handleCellChange(record, 'price', v)}
          style={{ width: 110 }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val) => (val === 'open' || val === 1 ? '可订' : val === 'closed' || val === 0 ? '关房' : val || '-'),
    },
  ]

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>房态日历管理</h2>
        <Space>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
            保存修改
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchCalendar}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 筛选条件 */}
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Select
          placeholder="选择民宿"
          allowClear
          value={selectedHotelId}
          onChange={handleHotelChange}
          style={{ width: 180 }}
        >
          {hotels.map((h) => (
            <Select.Option key={h.id} value={h.id}>{h.name}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="选择房型"
          allowClear
          value={selectedRoomTypeId}
          onChange={(val) => setSelectedRoomTypeId(val)}
          style={{ width: 180 }}
        >
          {roomTypes.map((rt) => (
            <Select.Option key={rt.id} value={rt.id}>{rt.name}</Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="选择日期"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          style={{ width: 160 }}
        />
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </div>

      <Spin spinning={loading}>
        {data.length === 0 && !loading ? (
          <Empty description="暂无房态数据，请选择筛选条件后查询" />
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
    </div>
  )
}

export default RoomCalendar
