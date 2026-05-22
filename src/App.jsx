import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'antd/dist/reset.css'
import { Layout } from 'antd'
//Static Views
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

//Dynamic Views
import Dashboard from './pages/Dashboard.jsx'
import CarrierView from './pages/CarrierView.jsx'
import PublisherView from './pages/PublisherView.jsx'
import Sidebar from './components/Sidebar.jsx'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout className="main-title">
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/carrier/:carrierSlug" element={<CarrierView />} />
              <Route path="/publisher/:publisherSlug" element={<PublisherView />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Layout>
    </BrowserRouter>
  )
}

export default App
