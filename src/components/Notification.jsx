import React from 'react'

function Notification({ message, type }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle'
      case 'error':
        return 'fas fa-exclamation-circle'
      case 'warning':
        return 'fas fa-exclamation-triangle'
      default:
        return 'fas fa-info-circle'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#28a745'
      case 'error':
        return '#dc3545'
      case 'warning':
        return '#ffc107'
      default:
        return '#17a2b8'
    }
  }

  return (
    <div
      className="notification"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'white',
        color: getNotificationColor(type),
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderLeft: `4px solid ${getNotificationColor(type)}`,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        animation: 'slideInRight 0.3s ease'
      }}
    >
      <i className={getNotificationIcon(type)} style={{ fontSize: '1.2rem' }}></i>
      <span>{message}</span>
    </div>
  )
}

export default Notification 