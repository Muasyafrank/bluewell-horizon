import React from 'react';
import { render, screen } from '@testing-library/react';
import { useReveal } from './useReveal';

function Box() {
  const ref = useReveal();
  return <div ref={ref} data-testid="box" className="bw-reveal" />;
}

describe('useReveal', () => {
  const original = window.IntersectionObserver;
  afterEach(() => {
    window.IntersectionObserver = original;
  });

  it('leaves content visible when IntersectionObserver is unavailable', () => {
    delete window.IntersectionObserver;
    render(<Box />);
    expect(screen.getByTestId('box').classList.contains('bw-reveal--hidden')).toBe(false);
  });

  it('hides off-screen content until it is observed, then reveals it once', () => {
    let callback;
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn((cb) => {
      callback = cb;
      return { observe: jest.fn(), disconnect };
    });
    window.matchMedia = window.matchMedia || (() => ({ matches: false }));
    // jsdom reports every rect as 0, so push the element below the fold.
    const rect = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 5000 });

    render(<Box />);
    const box = screen.getByTestId('box');
    expect(box.classList.contains('bw-reveal--hidden')).toBe(true);

    callback([{ isIntersecting: false }]);
    expect(box.classList.contains('bw-reveal--hidden')).toBe(true);

    callback([{ isIntersecting: true }]);
    expect(box.classList.contains('bw-reveal--hidden')).toBe(false);
    expect(disconnect).toHaveBeenCalled();
    rect.mockRestore();
  });
});
