import { useState } from 'react'
import { Form, Input, Button, Alert, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const onSubmit = ({ username, password }) => {
    const user = login(username, password)
    if (!user) return setError('Invalid username or password')
    if (user.role === 'admin') navigate('/')
    else if (user.role === 'carrier') navigate(`/carrier/${user.scope}`)
    else if (user.role === 'publisher') navigate(`/publisher/${user.scope}`)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#041629' }}>
      <Card title="Login" style={{ width: 400 }}>
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
  )
}

export default Login
