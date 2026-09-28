import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Card from '../ui/Card';
import { resolveIcon } from '../../utils/icons';

/** Service summary card. Clickable variants open the detail dialog. */
export default function ServiceCard({ service, onSelect }) {
  const Icon = resolveIcon(service.icon);
  const interactive = Boolean(onSelect);

  return (
    <Card
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      interactive={interactive}
      onClick={interactive ? () => onSelect(service) : undefined}
      className="d-flex flex-column"
    >
      <span className="bw-feature-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3 className="bw-card__title">{service.title}</h3>
      <p className="bw-card__text flex-grow-1">{service.shortDesc}</p>
      {interactive ? (
        <span className="d-inline-flex align-items-center gap-2 mt-4 fw-semibold" style={{ color: 'var(--bw-teal-dark)' }}>
          Read more <FaArrowRight size={13} aria-hidden="true" />
        </span>
      ) : null}
    </Card>
  );
}
