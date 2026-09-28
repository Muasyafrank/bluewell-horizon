/**
 * Toast notifications.
 *
 * The previous helpers passed `iconTheme` (a react-hot-toast option that
 * react-toastify ignores) and repeated the same option object five times.
 * Styling now comes from the shared theme configured on the ToastContainer,
 * and these are thin, well-named wrappers.
 */
import { toast } from 'react-toastify';

export const toastSuccess = (message) => toast.success(message);
export const toastError = (message) => toast.error(message);
export const toastInfo = (message) => toast.info(message);
export const toastWarning = (message) => toast.warning(message);

/** Shows a pending toast; resolve it with `toastResolve`. */
export const toastLoading = (message) => toast.loading(message);

export const toastResolve = (toastId, message, type = 'success') => {
  if (toastId == null) {
    return type === 'error' ? toastError(message) : toastSuccess(message);
  }
  return toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 4000,
    closeOnClick: true,
  });
};

export const toastDismiss = (toastId) => toast.dismiss(toastId);
