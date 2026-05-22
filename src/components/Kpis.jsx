import { Row, Col, Card, Statistic } from 'antd'

function KPIs({ data }) {
  const total = data.length
  const paid = data.filter(s => s.paidAt).length
  const revenue = data.reduce((sum, s) => sum + Number(s.paidPrice || 0), 0)
  const conversionRate = total > 0 ? (paid / total) * 100 : 0

  return (
    <div style={{ padding: '0 20px', marginTop: 20 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={revenue}
              precision={2}
              prefix="$"
              suffix="ARS"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Sessions"
              value={total}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={conversionRate}
              precision={1}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default KPIs
