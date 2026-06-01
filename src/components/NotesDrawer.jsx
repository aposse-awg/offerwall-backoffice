import {
  Drawer,
  Button,
  Input,
  Empty,
  Space,
  Tag,
  Steps,
  Segmented,
} from 'antd'
import { SendOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function NotesDrawer({
  session,
  open,
  onClose,
  onAddNote,
  onUpdateReviewStatus,
}) {
  const { user } = useAuth()
  const [noteText, setNoteText] = useState('')
  const [reviewStatus, setReviewStatus] = useState(
    session.review_status || 'pending',
  )

  const handleAddNote = () => {
    if (!noteText.trim()) {
      alert('Note cannot be empty')
      return
    }

    const newNote = {
      id: Date.now().toString(),
      content: noteText,
      author: user.username,
      author_role: user.role,
      author_scope: user.scope,
      timestamp: new Date().toISOString(),
    }

    onAddNote(session.id, newNote)
    setNoteText('')
  }

  const notes = session.notes || []
  const reviewItems = [
    { title: 'No Review', className: 'step-no-review' },
    { title: 'Reviewing', className: 'step-reviewing' },
    { title: 'Finished Review', className: 'step-finished' },
  ]

  const statusMap = { pending: 0, reviewing: 1, finished: 2 }
  const reverseStatusMap = ['no review', 'reviewing', 'finished']

  const handleStatusChange = (stepIndex) => {
    const newStatus = reverseStatusMap[stepIndex]
    setReviewStatus(newStatus)
    onUpdateReviewStatus(session.id, newStatus)
  }

  useEffect(() => {
    if (open) {
      setReviewStatus(session.review_status || 'no review')
    }
  }, [session.id, open])

  return (
    <Drawer
      title={`Notes - Session ${session.id?.substring(0, 8)}`}
      onClose={onClose}
      open={open}
      size="large"
    >
      <div style={{ marginBottom: 24 }}>
        <h3>Review Status</h3>
        <Steps
          type="navigation"
          current={statusMap[reviewStatus] ?? 0}
          onChange={(value) => handleStatusChange(value)}
          items={reviewItems}
        />
      </div>

      {/* Notes history */}
      <div style={{ marginBottom: 24 }}>
        <h3>History</h3>
        {notes.length === 0 ? (
          <Empty description="No notes" />
        ) : (
          <Space orientation="vertical" style={{ width: '100%' }}>
            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: 12,
                  border: '1px solid #f0f0f0',
                  borderRadius: 4,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Tag>{note.author}</Tag>
                  <span style={{ fontSize: 12, color: '#999' }}>
                    {' '}
                    {new Date(note.timestamp).toLocaleString('en-US')}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{note.content}</p>
              </div>
            ))}
          </Space>
        )}
      </div>

      {/* Add note */}
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        <h3>Add Note and Status</h3>
        <Input.TextArea
          rows={4}
          placeholder="Write your note here..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleAddNote}
          block
        >
          Add Note
        </Button>
      </div>
    </Drawer>
  )
}

export default NotesDrawer
