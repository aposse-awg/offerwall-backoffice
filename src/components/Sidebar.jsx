import { useState } from 'react'
import { Button, Menu } from 'antd'
import {
  HomeOutlined,
  PhoneOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import sessions from '../data/sessions.json'

const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-')

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isInPaymentEntityView = location.pathname.startsWith('/payment-entity/')
  const isInPublisherView = location.pathname.startsWith('/publisher/')
  const isInSpecificView = isInPaymentEntityView || isInPublisherView

  const paymentEntityItems = [
    ...new Set(sessions.map((s) => s.provider?.name).filter(Boolean)),
  ].map((name) => ({
    key: `/payment-entity/${slugify(name)}`,
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
            key: 'payment-entities',
            label: 'Payment Entities',
            icon: <PhoneOutlined />,
            children: paymentEntityItems,
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ width: collapsed ? 80 : 256, flexShrink: 0 }}>
      {!collapsed && user && (
        <div style={{ marginBottom: 18, fontSize: '1.5em' }}>
          Hi, {user.username}
        </div>
      )}
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
        onClick={({ key }) => {
          if (key.startsWith('/')) navigate(key)
        }}
        items={items}
      />

      {user && (
        <div>
          <Button
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            style={{
              marginTop: '28px',
              color: '#ffffff',
              backgroundColor: '#db4447',
              width: '90%',
              border: 'none',
            }}
            block
          >
            {!collapsed && 'Logout'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
