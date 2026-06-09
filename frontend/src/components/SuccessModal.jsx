import React from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessModal = ({ show, handleClose }) => {
  if (!show) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1040, backgroundColor: 'rgba(11, 37, 64, 0.7)' }}
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ zIndex: 1050 }}
        onClick={handleClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 rounded-4 shadow-lg text-center p-5" style={{ backgroundColor: '#ffffff' }}>
            <div className="modal-body">
              {/* Success Icon */}
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4" 
                style={{ width: '90px', height: '90px', backgroundColor: '#f0f9fa', color: '#2fa5b6', fontSize: '3rem' }}
              >
                <FaCheckCircle />
              </div>
              
              <h3 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Message Sent Successfully!</h3>
              <p className="mb-4" style={{ color: '#4a5568', lineHeight: 1.6 }}>
                Thank you for contacting <strong>Bluewell Horizon Limited</strong>. Our team has received your inquiry and will get back to you within 24 hours.
              </p>
              <p className="mb-4 small" style={{ color: '#718096' }}>
                A confirmation email has also been sent to your inbox.
              </p>
              
              <button 
                type="button" 
                className="btn rounded-pill px-5 py-2 fw-semibold" 
                onClick={handleClose}
                style={{ backgroundColor: '#2fa5b6', color: '#ffffff', border: 'none' }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default SuccessModal;