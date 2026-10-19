import React from 'react';
import { SectionHeading } from '../ui';
import { useReveal } from '../../hooks';

/** Up to this many steps fit side by side on a wide screen. */
const MAX_HORIZONTAL_STEPS = 6;

/**
 * The ordered steps themselves: side by side on wide screens, stacked on
 * narrow ones. More than six steps (the admin can add any number) stay
 * stacked, because the connecting line cannot wrap onto a second row. Pass
 * `stacked` to force the vertical layout, e.g. inside a narrow column.
 *
 * `steps` are `{ title, description, stepNumber? }` in order.
 */
export function ProcessList({ steps, stacked = false }) {
  const ref = useReveal();
  const horizontal = !stacked && steps.length > 0 && steps.length <= MAX_HORIZONTAL_STEPS;

  return (
    <ol
      className={`bw-chain bw-reveal ${horizontal ? '' : 'bw-chain--stacked'}`}
      style={{ '--steps': Math.min(steps.length, MAX_HORIZONTAL_STEPS) }}
      ref={ref}
    >
      {steps.map((step, index) => (
        <li className="bw-chain__step" key={step.id ?? step.title}>
          <span className="bw-chain__number" aria-hidden="true">{step.stepNumber ?? index + 1}</span>
          <h3 className="bw-chain__title">{step.title}</h3>
          <p className="bw-chain__text">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** A full-width section: heading, then the steps. */
export default function ProcessTimeline({ steps, eyebrow, title, lead, tone = 'tint' }) {
  return (
    <section className={`bw-section ${tone === 'tint' ? 'bw-section--tint' : ''}`}>
      <div className="container">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} lead={lead} className="mb-5" />
        <ProcessList steps={steps} />
      </div>
    </section>
  );
}
