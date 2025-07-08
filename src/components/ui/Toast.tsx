'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { notificationSlide } from '@/lib/animations'
import { useNotifications, type Notification } from '@/stores'

export interface ToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ notification, onRemove }) => {
  const { id, type, title, message, action } = notification

  const typeConfig = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  }

  const config = typeConfig[type]

  return (
    <motion.div
      className={cn(
        'relative flex items-start p-4 rounded-lg border shadow-lg max-w-sm w-full',
        config.bgColor,
        config.borderColor
      )}
      initial={notificationSlide.initial}
      animate={notificationSlide.animate}
      exit={notificationSlide.exit}
      layout
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 mr-3', config.iconColor)}>
        <span className="text-xl">{config.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn('text-sm font-medium', config.textColor)}>
          {title}
        </h4>
        {message && (
          <p className={cn('mt-1 text-sm', config.textColor, 'opacity-90')}>
            {message}
          </p>
        )}
        {action && (
          <div className="mt-2">
            <button
              onClick={action.onClick}
              className={cn(
                'text-sm font-medium underline hover:no-underline',
                config.textColor
              )}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(id)}
        className={cn(
          'flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/10 transition-colors',
          config.textColor
        )}
        aria-label="Fermer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  )
}

// Conteneur pour afficher les toasts
export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications()

  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export { Toast }
