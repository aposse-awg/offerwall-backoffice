import { useState } from 'react'
import { Table, Grid } from 'antd'
const { useBreakpoint } = Grid

function SessionsTable({ data }) {
  const screens = useBreakpoint()
  const [filteredData, setFilteredData] = useState(data)

  const formatDate = (v) =>
    new Date(v).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })

  const emailFilters = [
    ...new Set(data.map((s) => s.email).filter(Boolean)),
  ].map((email) => ({ text: email, value: email }))

  const phoneFilters = [
    ...new Set(data.map((s) => s.phone).filter(Boolean)),
  ].map((phone) => ({ text: phone, value: phone }))

  const countryFilters = [
    ...new Set(data.map((s) => s.country).filter(Boolean)),
  ].map((c) => ({ text: c, value: c }))

  const carrierFilters = [
    ...new Set(data.map((s) => s.provider?.name).filter(Boolean)),
  ].map((name) => ({ text: name, value: name }))
  if (data.some((s) => !s.provider?.name)) {
    carrierFilters.push({ text: 'Unknown Carrier', value: 'Unknown Carrier' })
  }

  const publisherFilters = [
    ...new Set(data.map((s) => s.publisherId).filter(Boolean)),
  ].map((id) => ({ text: 'shonengamespodcast.com/', value: id }))

  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: formatDate,
      fixed: 'left',
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      sorter: (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt),
      render: formatDate,
    },
    {
      title: 'Session ID',
      dataIndex: 'id',
    },
    {
      title: 'Short Code',
      dataIndex: 'shortCode',
    },
    {
      title: 'Carrier',
      dataIndex: ['provider', 'name'],
      filters: carrierFilters,
      onFilter: (value, record) =>
        value === 'Unknown Carrier'
          ? !record.provider?.name
          : record.provider?.name === value,
      render: (name) => {
        if (!name) return 'Unknown Carrier'
        const icon =
          name === 'dLocal AR'
            ? 'https://www.dlocal.com/assets/images/static/favicon-2024-light.png'
            : 'https://www.claro.com.ar/favicon.ico'
        return (
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <img src={icon} alt={name} style={{ width: 16, marginRight: 8 }} />{' '}
            {name}
          </span>
        )
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      filters: countryFilters,
      onFilter: (value, record) => record.country === value,
    },

    {
      title: 'Publisher',
      dataIndex: 'publisherId',
      filters: publisherFilters,
      onFilter: (value, record) => record.publisherId === value,
      render: (id) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <img
            src="https://shonengamespodcast.com/wp-content/uploads/2023/06/cropped-shonen_favicon-32x32.png"
            style={{ width: 16 }}
          />
          <a
            style={{ color: 'inherit', textDecoration: 'none' }}
            href="https://shonengamespodcast.com/"
          >
            https://shonengamespodcast.com/
          </a>
        </span>
      ),
    },
    {
      title: 'Origin',
      dataIndex: 'origin',
    },
    {
      title: 'Paid At',
      dataIndex: 'paidAt',
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Unpaid', value: 'Unpaid' },
      ],
      render: (v) => (v ? `Paid at: ${formatDate(v)}` : 'Unpaid'),
      onFilter: (value, record) =>
        value === 'Paid' ? !!record.paidAt : !record.paidAt,
    },

    {
      title: 'Phone Number',
      dataIndex: 'phone',
      render: (v) => (v ? v : 'Not provided'),
      filters: phoneFilters,
      filterMode: 'menu',
      filterSearch: true,
      onFilter: (value, record) => record.phone?.startsWith(value),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (v) => (v ? v : 'Not provided'),
      filters: emailFilters,
      filterMode: 'menu',
      filterSearch: true,
      onFilter: (value, record) => record.email?.startsWith(value),
    },

    {
      title: 'Paid Price',
      dataIndex: 'paidPrice',
      render: (v) => (v ? `ARS$${v}` : 'N/A'),
      fixed: 'right',
    },
  ]
  const paidPriceIndex = columns.findIndex((c) => c.dataIndex === 'paidPrice')
  const totalPaidPrice = filteredData.reduce(
    (sum, s) => sum + Number(s.paidPrice || 0),
    0,
  )

  return (
    <Table
      style={{ margin: screens.md ? '20px' : '10px' }}
      columns={columns}
      dataSource={data}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      size={screens.md ? 'middle' : 'small'}
      onChange={(pagination, filters, sorter, extra) =>
        setFilteredData(extra.currentDataSource)
      }
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={columns.length}>
              <em>
                Records: {filteredData.length} of {data.length}
              </em>
            </Table.Summary.Cell>
          </Table.Summary.Row>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={paidPriceIndex}>
              <strong>Total Paid</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={paidPriceIndex}>
              <strong>
                {totalPaidPrice.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                })}
              </strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  )
}

export default SessionsTable
