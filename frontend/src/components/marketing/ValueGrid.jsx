import React from 'react';
import Card from '../ui/Card';
import { resolveIcon } from '../../utils/icons';

/** Grid of company values or capabilities. */
export default function ValueGrid({ items, columns = 'col-md-6 col-lg-3' }) {
  return (
    <div className="row g-4">
      {items.map((item) => {
        const Icon = resolveIcon(item.icon);
        return (
          <div className={columns} key={item.title}>
            <Card className="text-center">
              <span className="bw-feature-icon bw-feature-icon--soft mx-auto" aria-hidden="true">
                <Icon />
              </span>
              <h3 className="bw-card__title">{item.title}</h3>
              <p className="bw-card__text">{item.description}</p>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
