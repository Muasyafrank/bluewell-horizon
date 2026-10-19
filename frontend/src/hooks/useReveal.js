import { useLayoutEffect, useRef } from 'react';

/**
 * Fades an element in the first time it scrolls into view.
 *
 * Returns a ref to attach to the element. Content is never hidden unless the
 * browser can actually reveal it again: with no IntersectionObserver, or for
 * visitors who prefer reduced motion, the element is simply shown. Elements
 * that are already on screen when the page loads are not hidden at all, so
 * there is no flash.
 *
 * Pair with the `.bw-reveal` / `.bw-reveal--hidden` classes in styles/base.css.
 */
export function useReveal() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canObserve || reducedMotion) return undefined;

    const { top } = element.getBoundingClientRect();
    if (top < window.innerHeight) return undefined; // already visible

    element.classList.add('bw-reveal--hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.remove('bw-reveal--hidden');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      element.classList.remove('bw-reveal--hidden');
    };
  }, []);

  return ref;
}
