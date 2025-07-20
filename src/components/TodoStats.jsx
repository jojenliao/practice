import React from 'react'

function TodoStats({ stats }) {
  return (
    <div className="todo-stats">
      <span>总计: {stats.total}</span>
      <span>已完成: {stats.completed}</span>
      <span>剩余: {stats.remaining}</span>
    </div>
  )
}

export default TodoStats 