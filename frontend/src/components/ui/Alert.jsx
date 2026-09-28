import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const TONES = {
  success: { className: 'bw-alert--success', icon: <FaCheckCircle /> },
  danger: { className: 'bw-alert--danger', icon: <FaExclamationCircle /> },
  info: { className: 'bw-alert--info', icon: <FaInfoCircle /> },
};

export default function Alert({ tone = 'info', children, className = '' }) {
  const config = TONES[tone] || TONES.info;

  return (
    <div
      className={['bw-alert', config.className, className].filter(Boolean).join(' ')}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{children}</span>
    </div>
  );
}
