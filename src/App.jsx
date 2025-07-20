import React, { useState, useEffect } from 'react'
import TodoHeader from './components/TodoHeader'
import TodoInput from './components/TodoInput'
import TodoFilters from './components/TodoFilters'
import TodoStats from './components/TodoStats'
import TodoList from './components/TodoList'
import TodoActions from './components/TodoActions'
import Notification from './components/Notification'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [notification, setNotification] = useState(null)

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }
  }, [])

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // 显示通知
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // 添加任务
  const addTodo = (text) => {
    if (!text.trim()) {
      showNotification('请输入待办事项内容', 'error')
      return
    }

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prevTodos => [newTodo, ...prevTodos])
    showNotification('任务添加成功！', 'success')
  }

  // 切换任务状态
  const toggleTodo = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, completed: !todo.completed }
          if (updatedTodo.completed) {
            updatedTodo.completedAt = new Date().toISOString()
          } else {
            delete updatedTodo.completedAt
          }
          return updatedTodo
        }
        return todo
      })
    )
  }

  // 删除任务
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
    showNotification('任务已删除', 'info')
  }

  // 清除已完成任务
  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed))
    showNotification(`已清除 ${completedCount} 个已完成任务`, 'info')
  }

  // 清除所有任务
  const clearAll = () => {
    if (todos.length === 0) {
      showNotification('没有任务需要清除', 'info')
      return
    }

    if (window.confirm('确定要清除所有任务吗？此操作不可撤销。')) {
      const totalCount = todos.length
      setTodos([])
      showNotification(`已清除所有 ${totalCount} 个任务`, 'info')
    }
  }

  // 获取过滤后的任务
  const getFilteredTodos = () => {
    switch (currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }

  // 计算统计信息
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    remaining: todos.filter(todo => !todo.completed).length
  }

  return (
    <div className="container">
      <TodoHeader />
      <TodoInput onAddTodo={addTodo} />
      <TodoFilters 
        currentFilter={currentFilter} 
        onFilterChange={setCurrentFilter} 
      />
      <TodoStats stats={stats} />
      <TodoList 
        todos={getFilteredTodos()}
        currentFilter={currentFilter}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
      <TodoActions 
        onClearCompleted={clearCompleted}
        onClearAll={clearAll}
      />
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}
    </div>
  )
}

export default App 