import { useEffect } from 'react';

/** Calls `handler` when a pointer or focus event happens outside `ref`. */
export function useOnClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    document.addEventListener('focusin', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
      document.removeEventListener('focusin', listener);
    };
  }, [ref, handler, active]);
}
