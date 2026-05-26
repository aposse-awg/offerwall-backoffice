import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'antd/dist/reset.css'
import { AuthProvider } from './context/AuthContext.jsx'
//Static Views
import MainLayout from './components/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
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
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/carrier/:carrierSlug" element={<ProtectedRoute><CarrierView /></ProtectedRoute>} />
            <Route path="/publisher/:publisherSlug" element={<ProtectedRoute><PublisherView /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
