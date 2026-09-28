import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaTruck } from 'react-icons/fa';
import Badge from './Badge';
import { titleCase } from '../../utils/format';

/**
 * Order status pill, shared by the admin dashboard and the customer account
 * page. Both screens previously carried their own near-identical copy of this
 * mapping, so a new status had to be added in two files.
 */
const STATUSES = {
  processing: { tone: 'warning', icon: <FaClock /> },
  confirmed: { tone: 'info', icon: <FaCheckCircle /> },
  shipped: { tone: 'info', icon: <FaTruck /> },
  delivered: { tone: 'success', icon: <FaCheckCircle /> },
  cancelled: { tone: 'danger', icon: <FaTimesCircle /> },
};

export default function StatusBadge({ status }) {
  const key = (status || 'processing').toLowerCase();
  const config = STATUSES[key] || STATUSES.processing;

  return (
    <Badge tone={config.tone} icon={config.icon}>
      {titleCase(key)}
    </Badge>
  );
}

export const ORDER_STATUSES = Object.keys(STATUSES);
