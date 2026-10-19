import React from 'react';
import { SectionHeading } from '../ui';
import { useReveal } from '../../hooks';
import { resolveIcon } from '../../utils/icons';
import { CORE_VALUES } from '../../data/company';

/** The eight core values as numbered tiles. */
export default function ValuesSection({ lead }) {
  const ref = useReveal();

  return (
    <section className="bw-section bw-section--tint">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Our values"
          title="What guides our work"
          lead={lead}
          className="mb-5"
        />
        <ul className="bw-values bw-reveal" ref={ref}>
          {CORE_VALUES.map((value, index) => {
            const Icon = resolveIcon(value.icon);
            return (
              <li className="bw-value" key={value.title}>
                <span className="bw-value__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="bw-value__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3 className="bw-value__title">{value.title}</h3>
                <p className="bw-value__text">{value.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
