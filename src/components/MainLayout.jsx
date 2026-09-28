import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'
import { SessionsProvider } from '../context/SessionsContext.jsx'

function MainLayout() {
  return (
    <SessionsProvider>
      <Layout className="main-title">
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </div>
        </div>
        <Footer />
      </Layout>
    </SessionsProvider>
  )
}

export default MainLayout
