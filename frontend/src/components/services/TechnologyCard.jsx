import React from 'react';
import Card from '../ui/Card';
import { resolveIcon } from '../../utils/icons';

export default function TechnologyCard({ technology }) {
  const Icon = resolveIcon(technology.icon);

  return (
    <Card>
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="bw-feature-icon bw-feature-icon--soft mb-0" aria-hidden="true">
          <Icon />
        </span>
        <h3 className="bw-card__title mb-0">{technology.name}</h3>
      </div>
      <p className="bw-card__text">{technology.description}</p>
    </Card>
  );
}
