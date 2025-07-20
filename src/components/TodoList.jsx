import React from 'react'
import TodoItem from './TodoItem'

function TodoList({ todos, currentFilter, onToggleTodo, onDeleteTodo }) {
  if (todos.length === 0) {
    return (
      <ul className="todo-list">
        <div className="empty-state">
          <i className="fas fa-clipboard-list"></i>
          <h3>{getEmptyStateMessage(currentFilter)}</h3>
          <p>点击上方输入框添加新任务</p>
        </div>
      </ul>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
        />
      ))}
    </ul>
  )
}

function getEmptyStateMessage(filter) {
  switch (filter) {
    case 'active':
      return '没有进行中的任务'
    case 'completed':
      return '没有已完成的任务'
    default:
      return '开始添加您的第一个任务吧！'
  }
}

export default TodoList 