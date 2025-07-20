// Todo List 应用
class TodoApp {
    constructor() {
        try {
            console.log('TodoApp构造函数开始...');
            this.todos = JSON.parse(localStorage.getItem('todos')) || [];
            console.log('加载的任务数量:', this.todos.length);
            this.currentFilter = 'all';
            this.init();
            console.log('TodoApp构造函数完成');
        } catch (error) {
            console.error('TodoApp构造函数出错:', error);
        }
    }

    init() {
        try {
            console.log('开始初始化...');
            this.bindEvents();
            console.log('事件绑定完成');
            this.render();
            console.log('渲染完成');
            this.updateStats();
            console.log('统计更新完成');
        } catch (error) {
            console.error('初始化过程中出错:', error);
        }
    }

    bindEvents() {
        try {
            // 添加任务
            const addBtn = document.getElementById('addBtn');
            const todoInput = document.getElementById('todoInput');

            if (addBtn) {
                addBtn.addEventListener('click', () => this.addTodo());
            }
            if (todoInput) {
                todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addTodo();
                    }
                });
            }

            // 过滤按钮
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.setFilter(e.target.dataset.filter);
                });
            });

            // 清除按钮
            const clearCompletedBtn = document.getElementById('clearCompleted');
            const clearAllBtn = document.getElementById('clearAll');
            
            if (clearCompletedBtn) {
                clearCompletedBtn.addEventListener('click', () => {
                    this.clearCompleted();
                });
            }
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    this.clearAll();
                });
            }
        } catch (error) {
            console.error('事件绑定过程中出错:', error);
        }
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            this.showNotification('请输入待办事项内容', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        this.updateStats();

        input.value = '';
        this.showNotification('任务添加成功！', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            // 记录完成时间
            if (todo.completed) {
                todo.completedAt = new Date().toISOString();
            } else {
                delete todo.completedAt;
            }
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.updateStats();
        this.showNotification('任务已删除', 'info');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        this.todos = this.todos.filter(t => !t.completed);
        this.saveToStorage();
        this.render();
        this.updateStats();
        this.showNotification(`已清除 ${completedCount} 个已完成任务`, 'info');
    }

    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('没有任务需要清除', 'info');
            return;
        }

        if (confirm('确定要清除所有任务吗？此操作不可撤销。')) {
            const totalCount = this.todos.length;
            this.todos = [];
            this.saveToStorage();
            this.render();
            this.updateStats();
            this.showNotification(`已清除所有 ${totalCount} 个任务`, 'info');
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        try {
            const todoList = document.getElementById('todoList');
            const filteredTodos = this.getFilteredTodos();

            if (filteredTodos.length === 0) {
                todoList.innerHTML = this.getEmptyStateHTML();
                return;
            }

            todoList.innerHTML = filteredTodos.map(todo => this.getTodoItemHTML(todo)).join('');
            
            // 重新绑定事件
            this.bindTodoEvents();
        } catch (error) {
            console.error('渲染过程中出错:', error);
        }
    }

    getTodoItemHTML(todo) {
        const completedClass = todo.completed ? 'completed' : '';
        const checked = todo.completed ? 'checked' : '';
        
        // 格式化完成时间
        let completedTimeHTML = '';
        if (todo.completed && todo.completedAt) {
            const completedDate = new Date(todo.completedAt);
            const formattedTime = this.formatDateTime(completedDate);
            completedTimeHTML = `
                <div class="todo-completed-time">
                    <i class="fas fa-check-circle"></i>
                    <span>完成于: ${formattedTime}</span>
                </div>
            `;
        }
        
        return `
            <li class="todo-item ${completedClass}" data-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-main">
                        <input type="checkbox" class="todo-checkbox" ${checked}>
                        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                        <button class="todo-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${completedTimeHTML}
                </div>
            </li>
        `;
    }

    getEmptyStateHTML() {
        let message = '';
        switch (this.currentFilter) {
            case 'active':
                message = '没有进行中的任务';
                break;
            case 'completed':
                message = '没有已完成的任务';
                break;
            default:
                message = '开始添加您的第一个任务吧！';
        }

        return `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>${message}</h3>
                <p>点击上方输入框添加新任务</p>
            </div>
        `;
    }

    bindTodoEvents() {
        try {
            // 复选框事件
            document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const todoItem = e.target.closest('.todo-item');
                    if (todoItem) {
                        const id = parseInt(todoItem.dataset.id);
                        this.toggleTodo(id);
                    }
                });
            });

            // 删除按钮事件
            document.querySelectorAll('.todo-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const todoItem = e.target.closest('.todo-item');
                    if (todoItem) {
                        const id = parseInt(todoItem.dataset.id);
                        this.deleteTodo(id);
                    }
                });
            });
        } catch (error) {
            console.error('绑定任务事件时出错:', error);
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTasks').textContent = `总计: ${total}`;
        document.getElementById('completedTasks').textContent = `已完成: ${completed}`;
        document.getElementById('remainingTasks').textContent = `剩余: ${remaining}`;
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDateTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        // 如果是今天完成的
        if (days === 0) {
            if (hours === 0) {
                if (minutes < 1) {
                    return '刚刚';
                }
                return `${minutes}分钟前`;
            }
            return `${hours}小时前`;
        }
        
        // 如果是昨天完成的
        if (days === 1) {
            return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        
        // 其他时间显示完整日期
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('初始化Todo应用...');
        new TodoApp();
        console.log('Todo应用初始化完成');
    } catch (error) {
        console.error('初始化Todo应用时出错:', error);
    }
});

// 添加一些示例数据（可选）
function addSampleData() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const sampleTodos = [
        { id: 1, text: '学习JavaScript基础', completed: false, createdAt: new Date().toISOString() },
        { id: 2, text: '完成项目文档', completed: true, createdAt: yesterday.toISOString(), completedAt: oneHourAgo.toISOString() },
        { id: 3, text: '复习CSS布局', completed: false, createdAt: new Date().toISOString() },
        { id: 4, text: '设计用户界面', completed: true, createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), completedAt: yesterday.toISOString() }
    ];
    
    localStorage.setItem('todos', JSON.stringify(sampleTodos));
    // 移除 location.reload() 避免无限刷新
    // 直接重新初始化应用
    new TodoApp();
}

// 如果需要添加示例数据，可以取消注释下面这行
// addSampleData(); 