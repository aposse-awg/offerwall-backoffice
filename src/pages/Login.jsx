import { useState } from 'react'
import { Form, Input, Button, Alert, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const onSubmit = ({ username, password }) => {
    const user = login(username, password)
    if (!user) return setError('Invalid username or password')
    if (user.role === 'admin') navigate('/')
    else if (user.role === 'payment-entity') navigate(`/payment-entity/${user.scope}`)
    else if (user.role === 'publisher') navigate(`/publisher/${user.scope}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#041629' }}>
    <Navbar/>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
      <Card title="Login" style={{ width: 600 }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    <Footer/>
    </div>
  )
}

export default Login
