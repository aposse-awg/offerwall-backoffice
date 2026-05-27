import { Pie, Column, Line } from '@ant-design/charts'
import { Row, Col, Card, Segmented } from 'antd'
import { useState } from 'react'

function Insights({ data, variant = 'full' }) {
  const [period, setPeriod] = useState('day')

  const groupByPeriod = (dateStr, p) => {
    const d = new Date(dateStr)
    switch (p) {
      case 'day':
        return d.toISOString().slice(0, 10)
      case 'week': {
        const monday = new Date(d)
        monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
        return monday.toISOString().slice(0, 10)
      }
      case 'month':
        return d.toISOString().slice(0, 7)
      case 'year':
        return d.getFullYear().toString()
    }
  }

  const sessionsByPeriod = Object.entries(
    data.reduce((acc, s) => {
      const key = groupByPeriod(s.createdAt, period)
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}),
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const lineConfig = {
    data: sessionsByPeriod,
    autofit: true,
    responsive: true,
    xField: 'date',
    yField: 'count',
    point: { shape: 'circle', size: 4 },
    style: { stroke: '#324bdb' },
    label: {
      position: 'bottom',
      text: 'count',
      style: {
        fill: '#ffffff',
        fontSize: 10,
      },
    },
  }

  const paidVsUnpaid = [
    { type: 'Paid', value: data.filter((s) => s.paidAt).length },
    { type: 'Unpaid', value: data.filter((s) => !s.paidAt).length },
  ]

  const byPaymentEntity = Object.entries(
    data.reduce((acc, s) => {
      const name = s.provider?.name || 'Unknown Provider'
      acc[name] = (acc[name] || 0) + 1
      return acc
    }, {}),
  ).map(([paymentEntity, count]) => ({ paymentEntity, count }))

  const revenueByPaymentEntity = Object.entries(
    data.reduce((acc, s) => {
      const name = s.provider?.name || 'Unknown Provider'
      acc[name] = (acc[name] || 0) + Number(s.paidPrice || 0)
      return acc
    }, {}),
  ).map(([paymentEntity, revenue]) => ({ paymentEntity, revenue }))

  const pieConfig = {
    data: paidVsUnpaid,
    autofit: true,
    responsive: true,
    angleField: 'value',
    colorField: 'type',
    label: { text: 'value', fontSize: 16 },
    legend: { position: 'bottom' },
    scale: {
      color: {
        range: ['#324bdb', '#f03711'],
      },
    },
  }

  const columnConfig = {
    data: byPaymentEntity,
    autofit: true,
    responsive: true,

    xField: 'paymentEntity',
    yField: 'count',
    colorField: 'paymentEntity',
    label: {
      position: 'bottom',
      style: {
        fill: '#ffffff',
        fontSize: 12,
      },
    },
    scale: {
      color: {
        range: ['#0f42fa', '#d6281c', '#008d3f'],
      },
    },
  }

  const revenueConfig = {
    data: revenueByPaymentEntity,
    autofit: true,
    responsive: true,
    xField: 'paymentEntity',
    yField: 'revenue',
    colorField: 'paymentEntity',
    label: {
      position: 'bottom',
      text: (datum) =>
        datum.revenue.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0,
        }),
      style: {
        fill: '#ffffff',
        fontSize: 14,
      },
    },

    scale: {
      color: {
        range: ['#0f42fa', '#d6281c', '#008d3f'],
      },
    },
  }

  return (
    <div style={{ padding: '0 20px', marginTop: 24, overflow: 'hidden', width: '100%' }}>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col xs={24} md={12}>
          <Card title="Paid vs Unpaid Sessions">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        {variant !== 'payment-entity' && (
          <>
            <Col xs={24} md={12}>
              <Card title="Transactions by Payment Entity">
                <Column {...columnConfig} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Revenue by Payment Entity">
                <Column {...revenueConfig} />
              </Card>
            </Col>
          </>
        )}
        <Col xs={24} md={12}>
          <Card
            title={`Sessions By ${period.charAt(0).toUpperCase() + period.slice(1)}`}
            extra={
              <Segmented
                value={period}
                onChange={setPeriod}
                options={[
                  { label: 'Day', value: 'day' },
                  { label: 'Week', value: 'week' },
                  { label: 'Month', value: 'month' },
                  { label: 'Year', value: 'year' },
                ]}
              />
            }
          >
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Insights
