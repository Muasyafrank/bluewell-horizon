import React, { useId, useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { adminApi } from '../../api';
import { Image } from '../../components/common';
import { toastError } from '../../utils/toast';

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads an image and reports back the stored path.
 *
 * This lived inside the dashboard's render function before, so it was a brand
 * new component type on every keystroke — React unmounted and remounted it
 * each time, which reset the file input and dropped any upload in progress.
 * It also swallowed failures silently: `handleImageUpload` had a `finally` but
 * no `catch`, so a rejected upload left the spinner off and nothing uploaded.
 */
export default function ImageUploadField({ value, onChange, token, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const inputId = useId();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Choose an image file');
      return;
    }

    if (file.size > MAX_BYTES) {
      toastError('Images must be smaller than 5 MB');
      return;
    }

    setUploading(true);
    try {
      const data = await adminApi.uploadImage(file, { token });
      onChange(data.imagePath);
    } catch (error) {
      toastError(error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bw-field">
      <label className="bw-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        className="bw-field__control"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
      />
      {uploading ? (
        <span className="bw-field__hint" role="status">
          <FaUpload aria-hidden="true" /> Uploading…
        </span>
      ) : null}
      {value ? (
        <div className="d-flex align-items-center gap-2 mt-2 p-2 rounded" style={{ backgroundColor: 'var(--bw-surface)' }}>
          <Image src={value} alt="" className="bw-thumb bw-thumb--sm" />
          <small className="text-muted text-truncate">{value}</small>
          <button
            type="button"
            className="bw-nav-link ms-auto"
            style={{ color: 'var(--bw-danger)' }}
            onClick={() => onChange('')}
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
