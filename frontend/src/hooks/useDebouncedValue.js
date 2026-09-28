import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stopped changing for `delay` milliseconds.
 * Used by the shop search box so filtering does not run on every keystroke.
 */
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
