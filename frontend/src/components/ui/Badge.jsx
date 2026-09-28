import React from 'react';

const TONES = {
  default: '',
  navy: 'bw-badge--navy',
  neutral: 'bw-badge--neutral',
  success: 'bw-badge--success',
  warning: 'bw-badge--warning',
  danger: 'bw-badge--danger',
  info: 'bw-badge--info',
};

export default function Badge({ tone = 'default', icon = null, className = '', children }) {
  return (
    <span className={['bw-badge', TONES[tone] ?? '', className].filter(Boolean).join(' ')}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}
