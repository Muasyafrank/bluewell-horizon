import React, { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useBodyScrollLock } from '../../hooks';
import Button from './Button';

const SIZES = { md: '', lg: 'bw-modal--lg', xl: 'bw-modal--xl' };

/**
 * Accessible dialog.
 *
 * The previous modals were plain divs: no escape key, no focus management, no
 * `role="dialog"`, and the page behind them kept scrolling. They were also
 * declared *inside* the dashboard component body, which remounted every input
 * on each keystroke and made the form lose focus after every character. This
 * component lives at module scope and is rendered through a portal.
 */
export default function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitting = false,
}) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useId();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const node = dialogRef.current;
    const focusable = node?.querySelector(
      'input, select, textarea, button:not([data-modal-close]), [href], [tabindex]:not([tabindex="-1"])',
    );
    (focusable || node)?.focus();

    return () => {
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      // Keep keyboard focus inside the dialog while it is open.
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!open) return null;

  const body = (
    <div
      className="bw-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={dialogRef}
        className={['bw-modal', SIZES[size] ?? ''].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="bw-modal__header">
          <h2 className="bw-modal__title" id={titleId}>
            {title}
          </h2>
          <button
            type="button"
            className="bw-icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
            data-modal-close
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {onSubmit ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(event);
            }}
            className="d-flex flex-column overflow-hidden"
          >
            <div className="bw-modal__body">{children}</div>
            <div className="bw-modal__footer">
              <Button variant="outline" onClick={onClose} data-modal-close>
                {cancelLabel}
              </Button>
              <Button type="submit" loading={submitting} loadingText="Saving">
                {submitLabel}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="bw-modal__body">{children}</div>
            {footer ? <div className="bw-modal__footer">{footer}</div> : null}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
