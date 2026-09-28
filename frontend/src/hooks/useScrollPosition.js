import { useEffect, useState } from 'react';

/**
 * Tracks whether the page is scrolled past `threshold`.
 * The scroll listener is passive and the state only flips at the boundary, so
 * the navbar re-renders twice per page rather than on every scroll frame.
 */
export function useScrolledPast(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = null;

    const handleScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        frame = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
