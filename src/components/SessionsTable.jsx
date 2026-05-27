import { useMemo } from 'react'
import { Table, Grid } from 'antd'
import { useSearchParams } from 'react-router-dom'
const { useBreakpoint } = Grid

function SessionsTable({ data }) {
  const screens = useBreakpoint()
  const [searchParams, setSearchParams] = useSearchParams()

  // ========== PASO 1: LEER ESTADO DESDE URL ==========
  // Extraemos filtros, sorter y pagination que el usuario guardó en la URL
  
  // Leer filtros: buscamos parámetros que comiencen con "filter_"
  // Ej: ?filter_country=AR,US&filter_paidAt=Paid
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

  // Leer sorter: buscamos sort_field y sort_order
  // Ej: ?sort_field=createdAt&sort_order=ascend
  const savedSorter = useMemo(() => {
    const field = searchParams.get('sort_field')
    const order = searchParams.get('sort_order')
    return field && order ? { field, order } : null
  }, [searchParams])

  // Leer pagination: buscamos page y pageSize
  // Ej: ?page=2&pageSize=10
  const savedPagination = useMemo(() => {
    return {
      current: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
    }
  }, [searchParams])

  // ========== PASO 2: VALIDAR FILTROS ==========
  // Algunos filtros guardados en URL pueden no existir en los datos actuales
  // (ej: filtrar por "dLocal" cuando estamos en CarrierView de Claro)
  // Aquí limpiamos esos filtros inválidos
  
  const validFilters = useMemo(() => {
    const filtered = {}
    Object.entries(savedFilters).forEach(([key, values]) => {
      const validValues = values.filter((v) => {
        // Caso especial: campos anidados como provider.name
        if (key === 'provider.name') {
          if (v === 'Unknown Provider') {
            return data.some((record) => !record.provider?.name)
          }
          return data.some((record) => String(record.provider?.name) === v)
        }
        // Caso especial: paidAt usa valores "Paid"/"Unpaid" pero el campo es booleano
        if (key === 'paidAt') {
          return data.some((record) =>
            v === 'Paid' ? !!record.paidAt : !record.paidAt,
          )
        }
        // Caso normal: comparar valor directamente
        return data.some((record) => String(record[key]) === v)
      })
      // Solo guardar si hay valores válidos
      if (validValues.length > 0) {
        filtered[key] = validValues
      }
    })
    return filtered
  }, [savedFilters, data])

  // ========== PASO 3: APLICAR FILTROS Y SORTER A LOS DATOS ==========
  // Este es el "motor" que calcula qué datos mostrar basado en:
  // - Los filtros válidos que el usuario seleccionó
  // - El campo y orden que el usuario eligió para ordenar
  
  const filteredData = useMemo(() => {
    let result = data

    // APLICAR FILTROS: dejar solo los registros que cumplen con todos los filtros
    if (Object.keys(validFilters).length > 0) {
      result = result.filter((record) =>
        Object.entries(validFilters).every(([key, values]) => {
          if (values.length === 0) return true

          // Caso especial: paidAt
          if (key === 'paidAt') {
            return values.some(v =>
              v === 'Paid' ? !!record.paidAt : !record.paidAt
            )
          }

          // Para otros campos, obtener el valor del registro
          let val
          if (key === 'provider.name') {
            // Caso especial: Unknown Provider
            if (values.includes('Unknown Provider') && !record.provider?.name) {
              return true
            }
            val = record.provider?.name
          } else {
            val = record[key]
          }
          // Incluir registro si su valor está en la lista de filtros seleccionados
          return values.includes(String(val))
        }),
      )
    }

    // APLICAR SORTER: ordenar los datos por el campo y dirección elegida
    if (savedSorter) {
      const { field, order } = savedSorter
      result = [...result].sort((a, b) => {
        let aVal, bVal

        // Obtener valores según el campo
        if (field === 'provider.name') {
          aVal = a.provider?.name
          bVal = b.provider?.name
        } else if (field === 'createdAt' || field === 'expiresAt' || field === 'paidAt') {
          // Convertir fechas a Date objects para comparación correcta
          aVal = new Date(a[field])
          bVal = new Date(b[field])
        } else {
          aVal = a[field]
          bVal = b[field]
        }

        // Comparar según orden ascendente o descendente
        if (order === 'ascend') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    return result
  }, [data, validFilters, savedSorter])

  const formatDate = (v) =>
    new Date(v).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })

  // ========== PASO 4: GENERAR OPCIONES DE FILTROS DINÁMICAMENTE ==========
  // Para cada columna, generamos la lista de valores únicos que existen en los datos actuales
  // Así en PaymentEntityView de Claro, el filtro de Payment Entity solo muestra "Claro"
  
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
      carrierFilters.push({ text: 'Unknown Provider', value: 'Unknown Provider' })
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

  // ========== PASO 5: DEFINIR COLUMNAS CON ESTADOS CONTROLADOS ==========
  // Cada columna puede tener:
  // - filteredValue: qué filtros están activos (para mostrar el icono azul)
  // - sortOrder: qué orden está activo (para mostrar la flecha de ordenamiento)
  
  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true, // Permite ordenar
      sortOrder: savedSorter?.field === 'createdAt' ? savedSorter.order : null, // Mostrar si está ordenado
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
      key: 'provider.name', // Key para identificar este filtro en el onChange
      filters: carrierFilters, // Opciones disponibles
      filteredValue: validFilters['provider.name'] || null, // Qué está seleccionado (muestra el icono azul)
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

  // ========== PASO 6: HANDLER DE CAMBIOS ==========
  // Cuando el usuario:
  // - Aplica un filtro
  // - Ordena por una columna
  // - Cambia de página
  // Este handler captura TODOS esos cambios y los guarda en la URL
  
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const newParams = new URLSearchParams()

    // Guardar en URL: número de página y cantidad de registros por página
    newParams.set('page', String(pagination.current))
    newParams.set('pageSize', String(pagination.pageSize))

    // Guardar en URL: todos los filtros activos con el prefijo "filter_"
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        newParams.set(`filter_${key}`, value.join(','))
      }
    })

    // Guardar en URL: campo y orden del sorter
    if (sorter && sorter.field) {
      newParams.set('sort_field', String(sorter.field))
      newParams.set('sort_order', String(sorter.order))
    }

    // Actualizar URL con los nuevos parámetros
    setSearchParams(newParams)
  }

  // ========== PASO 7: RENDERIZAR TABLE ==========
  // Controlado: le pasamos explícitamente qué mostrar (filtros, orden, página)
  // Antd lee estos valores y actualiza el UI
  
  return (
    <Table
      style={{ margin: screens.md ? '20px' : '10px' }}
      columns={columns}
      // Mostramos solo los datos de la página actual
      dataSource={filteredData.slice(
        (savedPagination.current - 1) * savedPagination.pageSize,
        savedPagination.current * savedPagination.pageSize
      )}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      size={screens.md ? 'middle' : 'small'}
      // Controlamos la paginación con valores de URL
      pagination={{
        current: savedPagination.current,
        pageSize: savedPagination.pageSize,
        total: filteredData.length, // Total de registros después de filtrar
      }}
      // Cuando algo cambia (filtro, orden, página), llamamos al handler
      onChange={handleTableChange}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={columns.length}>
              <em>
                Records: {filteredData.slice(
                  (savedPagination.current - 1) * savedPagination.pageSize,
                  savedPagination.current * savedPagination.pageSize
                ).length} of {filteredData.length}
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
