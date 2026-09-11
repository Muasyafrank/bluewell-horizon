import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast options matching Bluewell brand
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

// Success toast
export const toastSuccess = (message) => {
  toast.success(message, {
    ...defaultOptions,
    style: { backgroundColor: '#2fa5b6', color: '#ffffff' },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#2fa5b6',
    },
  });
};

// Error toast
export const toastError = (message) => {
  toast.error(message, {
    ...defaultOptions,
    style: { backgroundColor: '#dc3545', color: '#ffffff' },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#dc3545',
    },
  });
};

// Info toast
export const toastInfo = (message) => {
  toast.info(message, {
    ...defaultOptions,
    style: { backgroundColor: '#0b2540', color: '#ffffff' },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#0b2540',
    },
  });
};

// Warning toast
export const toastWarning = (message) => {
  toast.warning(message, {
    ...defaultOptions,
    style: { backgroundColor: '#ffc107', color: '#0b2540' },
    iconTheme: {
      primary: '#0b2540',
      secondary: '#ffc107',
    },
  });
};

// Loading toast (returns toastId so you can dismiss it later)
export const toastLoading = (message) => {
  return toast.loading(message, {
    ...defaultOptions,
    style: { backgroundColor: '#6c757d', color: '#ffffff' },
  });
};

// Dismiss toast
export const toastDismiss = (toastId) => {
  toast.dismiss(toastId);
};

// Update toast
export const toastUpdate = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
    ...defaultOptions,
  });
};