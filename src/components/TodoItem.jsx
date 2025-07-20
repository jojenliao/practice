import React from 'react'

function TodoItem({ todo, onToggle, onDelete }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays}天前`
      } else {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-main">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="todo-text">{todo.text}</span>
          <button
            className="todo-delete"
            onClick={() => onDelete(todo.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
        {todo.completed && todo.completedAt && (
          <div className="todo-completed-time">
            <i className="fas fa-check-circle"></i>
            <span>完成于: {formatDateTime(todo.completedAt)}</span>
          </div>
        )}
      </div>
    </li>
  )
}

export default TodoItem 