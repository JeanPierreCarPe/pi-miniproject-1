/**
 * Custom Modal/Alert component with app styling
 * Replaces browser alerts with beautiful custom modals
 */

/**
 * Shows a custom confirmation modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message
 * @param {string} options.confirmText - Confirm button text
 * @param {string} options.cancelText - Cancel button text
 * @param {string} options.type - Modal type: 'confirm', 'alert', 'success', 'error'
 * @returns {Promise<boolean>} True if confirmed, false if cancelled
 */
export function showModal({ 
  title = 'Confirmación', 
  message = '', 
  confirmText = 'Aceptar', 
  cancelText = 'Cancelar', 
  type = 'confirm' 
}) {
  return new Promise((resolve) => {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal-overlay')
    if (existingModal) {
      existingModal.remove()
    }

    // Create modal overlay
    const overlay = document.createElement('div')
    overlay.className = 'custom-modal-overlay'
    overlay.innerHTML = `
      <div class="custom-modal">
        <div class="modal-header">
          <div class="modal-icon ${type}">
            ${getIconForType(type)}
          </div>
          <h3 class="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">${message}</p>
        </div>
        <div class="modal-actions">
          ${type === 'alert' ? '' : `<button class="modal-btn cancel" id="modal-cancel">${cancelText}</button>`}
          <button class="modal-btn confirm ${type}" id="modal-confirm">${confirmText}</button>
        </div>
      </div>
    `

    // Add styles
    const styles = `
      <style>
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeInModal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 20px;
        }

        .custom-modal {
          background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 100%;
          overflow: hidden;
          transform: scale(0.9);
          animation: bounceIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .modal-header {
          padding: 32px 32px 24px 32px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .modal-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          font-size: 28px;
          color: #fff;
        }

        .modal-icon.confirm {
          background: linear-gradient(135deg, #A0522D, #8B4513);
        }
        .modal-icon.alert {
          background: linear-gradient(135deg, #F59E0B, #D97706);
        }
        .modal-icon.success {
          background: linear-gradient(135deg, #10B981, #059669);
        }
        .modal-icon.error {
          background: linear-gradient(135deg, #EF4444, #DC2626);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--cafe-principal);
          margin: 0;
        }

        .modal-body {
          padding: 0 32px 24px 32px;
          text-align: center;
        }

        .modal-message {
          font-size: 16px;
          color: var(--gris-medio);
          line-height: 1.5;
          margin: 0;
        }

        .modal-actions {
          padding: 24px 32px 32px 32px;
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .modal-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 0;
          min-width: 100px;
        }

        .modal-btn.cancel {
          background: #f3f4f6;
          color: var(--gris-medio);
        }

        .modal-btn.cancel:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
          color: #fff;
          box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
        }

        .modal-btn.confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(160, 82, 45, 0.4);
        }

        .modal-btn.success {
          background: linear-gradient(135deg, #10B981, #059669);
        }

        .modal-btn.error {
          background: linear-gradient(135deg, #EF4444, #DC2626);
        }

        @media (max-width: 480px) {
          .custom-modal {
            margin: 20px;
            max-width: calc(100vw - 40px);
          }
          
          .modal-header, .modal-body, .modal-actions {
            padding-left: 24px;
            padding-right: 24px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .modal-btn {
            width: 100%;
          }
        }

        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `

    // Add styles to head if not already added
    if (!document.querySelector('#modal-styles')) {
      const styleElement = document.createElement('div')
      styleElement.id = 'modal-styles'
      styleElement.innerHTML = styles
      document.head.appendChild(styleElement)
    }

    // Add to body
    document.body.appendChild(overlay)

    // Add event listeners
    const confirmBtn = overlay.querySelector('#modal-confirm')
    const cancelBtn = overlay.querySelector('#modal-cancel')

    const cleanup = () => {
      overlay.style.animation = 'fadeOut 0.2s ease forwards'
      setTimeout(() => {
        overlay.remove()
      }, 200)
    }

    confirmBtn.addEventListener('click', () => {
      cleanup()
      resolve(true)
    })

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        cleanup()
        resolve(false)
      })
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup()
        resolve(false)
      }
    })

    // Close on Escape key
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        cleanup()
        resolve(false)
        document.removeEventListener('keydown', handleKeydown)
      }
    }
    document.addEventListener('keydown', handleKeydown)
  })
}

/**
 * Shows a custom toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast')
  existingToasts.forEach(toast => toast.remove())

  const toast = document.createElement('div')
  toast.className = `custom-toast ${type}`
  toast.innerHTML = `
    <div class="toast-icon">
      ${getIconForType(type)}
    </div>
    <div class="toast-message">${message}</div>
    <button class="toast-close">&times;</button>
  `

  // Add toast styles if not already added
  if (!document.querySelector('#toast-styles')) {
    const styles = document.createElement('style')
    styles.id = 'toast-styles'
    styles.textContent = `
      .custom-toast {
        position: fixed;
        top: 24px;
        right: 24px;
        background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInFromRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: 400px;
        border-left: 4px solid;
      }

      .custom-toast.success { border-left-color: #10B981; }
      .custom-toast.error { border-left-color: #EF4444; }
      .custom-toast.warning { border-left-color: #F59E0B; }
      .custom-toast.info { border-left-color: #3B82F6; }

      .toast-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #fff;
        flex-shrink: 0;
      }

      .custom-toast.success .toast-icon { background: #10B981; }
      .custom-toast.error .toast-icon { background: #EF4444; }
      .custom-toast.warning .toast-icon { background: #F59E0B; }
      .custom-toast.info .toast-icon { background: #3B82F6; }

      .toast-message {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: var(--cafe-principal);
        line-height: 1.4;
      }

      .toast-close {
        background: none;
        border: 0;
        font-size: 20px;
        color: var(--gris-claro);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .toast-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--cafe-principal);
      }

      @keyframes slideInFromRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      @keyframes slideOutToRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }

      @media (max-width: 480px) {
        .custom-toast {
          right: 16px;
          left: 16px;
          top: 16px;
          max-width: none;
        }
      }
    `
    document.head.appendChild(styles)
  }

  document.body.appendChild(toast)

  // Auto remove after duration
  const autoRemove = setTimeout(() => {
    removeToast()
  }, duration)

  // Manual close
  const closeBtn = toast.querySelector('.toast-close')
  closeBtn.addEventListener('click', removeToast)

  function removeToast() {
    clearTimeout(autoRemove)
    toast.style.animation = 'slideOutToRight 0.3s ease forwards'
    setTimeout(() => {
      toast.remove()
    }, 300)
  }
}

/**
 * Gets icon for different types
 * @param {string} type - The type of icon needed
 * @returns {string} HTML string for icon
 */
function getIconForType(type) {
  const icons = {
    confirm: '<i class="fas fa-question-circle"></i>',
    alert: '<i class="fas fa-exclamation-triangle"></i>',
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-times-circle"></i>',
    info: '<i class="fas fa-info-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>'
  }
  return icons[type] || icons.info
}
