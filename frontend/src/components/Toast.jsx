import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({ show, message, type = 'success', onClose }) => {
  // Auto-hide the toast after 4 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === 'success' ? '#2fa5b6' : '#e53e3e';
  const Icon = type === 'success' ? FaCheckCircle : FaExclamationCircle;

  const toastContent = (
    <div 
      className="toast-container position-fixed bottom-0 end-0 p-3" 
      style={{ zIndex: 1100 }}
    >
      <div 
        className="toast show align-items-center text-white border-0 shadow-lg" 
        role="alert" 
        style={{ backgroundColor: bgColor, minWidth: '300px', borderRadius: '12px' }}
      >
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center gap-2 fw-medium">
            <Icon size={20} />
            {message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default Toast;