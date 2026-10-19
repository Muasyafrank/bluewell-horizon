import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProcessList } from './ProcessTimeline';

const steps = (count) =>
  Array.from({ length: count }, (_, index) => ({ id: index + 1, title: `Step ${index + 1}`, description: 'Does a thing.' }));

describe('ProcessList', () => {
  it('lays out up to six steps side by side and sizes the grid to the count', () => {
    render(<ProcessList steps={steps(4)} />);
    const list = screen.getByRole('list');
    expect(list.classList.contains('bw-chain--stacked')).toBe(false);
    expect(list.style.getPropertyValue('--steps')).toBe('4');
  });

  it('stacks the steps when there are more than six, since the connector cannot wrap', () => {
    render(<ProcessList steps={steps(7)} />);
    expect(screen.getByRole('list').classList.contains('bw-chain--stacked')).toBe(true);
  });

  it('can be forced to stack, for narrow columns', () => {
    render(<ProcessList steps={steps(3)} stacked />);
    expect(screen.getByRole('list').classList.contains('bw-chain--stacked')).toBe(true);
  });

  it('uses the step number from the API, falling back to position', () => {
    render(<ProcessList steps={[{ id: 1, stepNumber: 5, title: 'A', description: 'a' }, { id: 2, title: 'B', description: 'b' }]} />);
    const [first, second] = screen.getAllByRole('listitem');
    // Each item's text starts with its number, then its title.
    expect(first).toHaveTextContent(/^5A/);
    expect(second).toHaveTextContent(/^2B/);
  });

  it('renders every title and description as real text', () => {
    render(<ProcessList steps={steps(2)} />);
    expect(screen.getByRole('heading', { name: 'Step 2' })).toBeTruthy();
    expect(screen.getAllByText('Does a thing.')).toHaveLength(2);
  });
});
