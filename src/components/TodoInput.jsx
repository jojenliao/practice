import React, { useState } from 'react'

function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddTodo(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="todo-input">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="输入新的待办事项..."
        maxLength={100}
      />
      <button onClick={handleSubmit} className="add-btn">
        <i className="fas fa-plus"></i> 添加
      </button>
    </div>
  )
}

export default TodoInput 