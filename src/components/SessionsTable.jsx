import { useMemo, useState } from 'react'
import { Table, Grid, Button, Input } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
const { useBreakpoint } = Grid

function SessionsTable({ data }) {
  const screens = useBreakpoint()
  const [searchValue, setSearchValue] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  // Extract filters, sorter, pagination from URL
  const savedFilters = useMemo(() => {
    const filters = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '')
        filters[filterKey] = value.split(',').filter(Boolean)
      }
    })
    return filters
  }, [searchParams])

  // Extract sorter from URL params
  const savedSorter = useMemo(() => {
    const field = searchParams.get('sort_field')
    const order = searchParams.get('sort_order')
    return field && order ? { field, order } : null
  }, [searchParams])

  // Extract pagination from URL params
  const savedPagination = useMemo(() => {
    return {
      current: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
    }
  }, [searchParams])

  // Validate filters (remove filters not in current data)
  const validFilters = useMemo(() => {
    const filtered = {}
    Object.entries(savedFilters).forEach(([key, values]) => {
      const validValues = values.filter((v) => {
        // Nested field: provider.name
        if (key === 'provider.name') {
          if (v === 'Unknown Provider') {
            return data.some((record) => !record.provider?.name)
          }
          return data.some((record) => String(record.provider?.name) === v)
        }
        // Special case: paidAt field is boolean
        if (key === 'paidAt') {
          return data.some((record) =>
            v === 'Paid' ? !!record.paidAt : !record.paidAt,
          )
        }
        // Standard comparison
        return data.some((record) => String(record[key]) === v)
      })
      // Keep only valid values
      if (validValues.length > 0) {
        filtered[key] = validValues
      }
    })
    return filtered
  }, [savedFilters, data])

  // Apply filters and sorter to data
  const filteredData = useMemo(() => {
    let result = data

    // Filter records matching all criteria
    if (Object.keys(validFilters).length > 0) {
      result = result.filter((record) =>
        Object.entries(validFilters).every(([key, values]) => {
          if (values.length === 0) return true

          // Special case: paidAt boolean field
          if (key === 'paidAt') {
            return values.some((v) =>
              v === 'Paid' ? !!record.paidAt : !record.paidAt,
            )
          }

          // Get field value from record
          let val
          if (key === 'provider.name') {
            // Unknown Provider case
            if (values.includes('Unknown Provider') && !record.provider?.name) {
              return true
            }
            val = record.provider?.name
          } else {
            val = record[key]
          }
          // Include if value is in selected filters
          return values.includes(String(val))
        }),
      )
    }

    // Sort by field and direction
    if (savedSorter) {
      const { field, order } = savedSorter
      result = [...result].sort((a, b) => {
        let aVal, bVal

        // Get sort values
        if (field === 'provider.name') {
          aVal = a.provider?.name
          bVal = b.provider?.name
        } else if (
          field === 'createdAt' ||
          field === 'expiresAt' ||
          field === 'paidAt'
        ) {
          // Convert dates for comparison
          aVal = new Date(a[field])
          bVal = new Date(b[field])
        } else {
          aVal = a[field]
          bVal = b[field]
        }

        // Compare ascending/descending
        if (order === 'ascend') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    return result
  }, [data, validFilters, savedSorter])

  // Global search filter
  const searchedData = useMemo(() => {
    if (!searchValue.trim()) return filteredData

    const query = searchValue.toLowerCase()
    return filteredData.filter(record =>
      String(record.phone || '').toLowerCase().includes(query) ||
      String(record.email || '').toLowerCase().includes(query) ||
      String(record.id || '').toLowerCase().includes(query) ||
      String(record.shortCode || '').toLowerCase().includes(query)
    )
  }, [filteredData, searchValue])

  const formatDate = (v) =>
    new Date(v).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })

  // Generate dynamic filter options from data
  const {
    carrierFilters,
    publisherFilters,
    countryFilters,
    emailFilters,
    phoneFilters,
  } = useMemo(() => {
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
      carrierFilters.push({
        text: 'Unknown Provider',
        value: 'Unknown Provider',
      })
    }

    const publisherFilters = [
      ...new Set(data.map((s) => s.publisherId).filter(Boolean)),
    ].map((id) => ({ text: 'shonengamespodcast.com/', value: id }))

    return {
      carrierFilters,
      publisherFilters,
      countryFilters,
      emailFilters,
      phoneFilters,
    }
  }, [data])

  // Define table columns with controlled state
  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      sortOrder: savedSorter?.field === 'createdAt' ? savedSorter.order : null,
      render: formatDate,
      fixed: 'left',
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      sorter: true,
      sortOrder: savedSorter?.field === 'expiresAt' ? savedSorter.order : null,
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
      title: 'Payment Entity',
      dataIndex: ['provider', 'name'],
      key: 'provider.name',
      filters: carrierFilters,
      filteredValue: validFilters['provider.name'] || null,
      onFilter: (value, record) =>
        value === 'Unknown Provider'
          ? !record.provider?.name
          : record.provider?.name === value,
      render: (name) => {
        if (!name) return 'Unknown Provider'
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
      filteredValue: validFilters['country'] || null,
      onFilter: (value, record) => record.country === value,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisherId',
      filters: publisherFilters,
      filteredValue: validFilters['publisherId'] || null,
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
      filteredValue: validFilters['paidAt'] || null,
      render: (v) => (v ? `Paid at: ${formatDate(v)}` : 'Unpaid'),
      onFilter: (value, record) =>
        value === 'Paid' ? !!record.paidAt : !record.paidAt,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      render: (v) => (v ? v : 'Not provided'),
      filters: phoneFilters,
      filteredValue: validFilters['phone'] || null,
      filterMode: 'menu',
      filterSearch: true,
      onFilter: (value, record) => record.phone?.startsWith(value),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (v) => (v ? v : 'Not provided'),
      filters: emailFilters,
      filteredValue: validFilters['email'] || null,
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

  // Handle table changes (filters, sort, pagination)
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const newParams = new URLSearchParams()

    // Save pagination to URL
    newParams.set('page', String(pagination.current))
    newParams.set('pageSize', String(pagination.pageSize))

    // Save active filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        newParams.set(`filter_${key}`, value.join(','))
      }
    })

    // Save sorter to URL
    if (sorter && sorter.field) {
      newParams.set('sort_field', String(sorter.field))
      newParams.set('sort_order', String(sorter.order))
    }

    // Update URL with new params
    setSearchParams(newParams)
  }

  const handleExportCSV = () => {
    const headers = columns.map((col) => col.title).join(',')

    const rows = filteredData.map((record) => {
      return columns
        .map((col) => {
          let value

          if (Array.isArray(col.dataIndex)) {
            value = col.dataIndex.reduce((obj, key) => obj?.[key], record)
          } else {
            value = record[col.dataIndex]
          }

          if (
            col.dataIndex === 'createdAt' ||
            col.dataIndex === 'expiresAt' ||
            col.dataIndex === 'paidAt'
          ) {
            value = value ? formatDate(value) : ''
          }

          return `"${String(value || '').replace(/"/g, '""')}"`
        })
        .join(',')
    })

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'sessions.csv')
    link.click()
  }

  // Render controlled table
  return (
    <>


      <div className="search-export-container">
          <Input.Search
    placeholder="Search by phone, email, session ID or short code"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    style={{ maxWidth: 300 }}
    allowClear
  />
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportCSV}
        >
          {' '}
          Export to CSV
        </Button>
      </div>
      <Table
        style={{ margin: screens.md ? '20px' : '10px' }}
        columns={columns}
        // Show current page data
        dataSource={searchedData.slice(
          (savedPagination.current - 1) * savedPagination.pageSize,
          savedPagination.current * savedPagination.pageSize,
        )}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        size={screens.md ? 'middle' : 'small'}
        // Control pagination from URL
        pagination={{
          current: savedPagination.current,
          pageSize: savedPagination.pageSize,
          total: searchedData.length,
        }}
        // Call handler on table changes
        onChange={handleTableChange}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={columns.length}>
                <em>
                  Records:{' '}
                  {
                    filteredData.slice(
                      (savedPagination.current - 1) * savedPagination.pageSize,
                      savedPagination.current * savedPagination.pageSize,
                    ).length
                  }{' '}
                  of {filteredData.length}
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
    </>
  )
}

export default SessionsTable
