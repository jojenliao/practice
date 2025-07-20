import React from 'react'

function TodoActions({ onClearCompleted, onClearAll }) {
  return (
    <div className="todo-actions">
      <button onClick={onClearCompleted} className="clear-btn">
        <i className="fas fa-trash"></i> 清除已完成
      </button>
      <button onClick={onClearAll} className="clear-btn">
        <i className="fas fa-trash-alt"></i> 清除全部
      </button>
    </div>
  )
}

export default TodoActions 