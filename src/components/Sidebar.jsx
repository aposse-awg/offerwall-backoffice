import { useState } from 'react'
import { Button, Menu } from 'antd'
import {
  HomeOutlined,
  ApiOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import sessions from '../data/sessions.json'

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-')

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isInCarrierView = location.pathname.startsWith('/carrier/')
  const isInPublisherView = location.pathname.startsWith('/publisher/')
  const isInSpecificView = isInCarrierView || isInPublisherView

  const carrierItems = [
    ...new Set(sessions.map((s) => s.provider?.name).filter(Boolean)),
  ].map((name) => ({
    key: `/carrier/${slugify(name)}`,
    label: name,
  }))

  const publisherItems = [
    { key: '/publisher/shonengamespodcast', label: 'shonengamespodcast.com/' },
  ]

  const items = [
    { key: '/', label: 'Dashboard', icon: <HomeOutlined /> },
    ...(!isInSpecificView
      ? [
          {
            key: 'carriers',
            label: 'Carriers',
            icon: <ApiOutlined />,
            children: carrierItems,
          },
          {
            key: 'publishers',
            label: 'Publishers',
            icon: <UserOutlined />,
            children: publisherItems,
          },
        ]
      : []),
  ]

  return (
    <div style={{ width: collapsed ? 80 : 256, flexShrink: 0 }}>
      <Button
        type="primary"
        onClick={() => setCollapsed(!collapsed)}
        style={{ margin: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['carriers', 'publishers']}
        onClick={({ key }) => {
          if (key.startsWith('/')) navigate(key)
        }}
        items={items}
      />
    </div>
  )
}

export default Sidebar
