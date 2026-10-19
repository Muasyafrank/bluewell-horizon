import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { Image } from '../../../components/common';
import { StatusBadge } from '../../../components/ui';
import { formatDate, pluralise } from '../../../utils/format';
import { PROGRESS_STEPS, progressIndex } from './orderSummary';

const THUMBNAILS_SHOWN = 4;

/** Delivery progress: Received → Confirmed → On the way → Delivered. */
function OrderProgress({ status }) {
  const current = progressIndex(status);
  // Once delivered there is nothing left to do, so show every step as done
  // rather than leaving the last one marked as "current".
  const finished = current === PROGRESS_STEPS.length - 1;

  if (current === -1) {
    return (
      <p className="bw-order__cancelled">
        This order is not active. <Link to="/contact">Contact us</Link> if you have questions.
      </p>
    );
  }

  return (
    <ol className="bw-progress" aria-label="Order progress">
      {PROGRESS_STEPS.map((step, index) => {
        const state = finished || index < current ? 'done' : index === current ? 'current' : 'todo';
        return (
          <li
            key={step.key}
            className={`bw-progress__step bw-progress__step--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="bw-progress__dot" aria-hidden="true">
              {state === 'done' ? <FaCheck /> : index + 1}
            </span>
            <span className="bw-progress__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** One past order: summary, items, progress, and an expandable item list. */
export default function OrderCard({ order }) {
  const items = order.items || [];
  const hiddenCount = items.length - THUMBNAILS_SHOWN;

  return (
    <article className="bw-order">
      <header className="bw-order__header">
        <div>
          <h3 className="bw-order__number">{order.orderNumber}</h3>
          <p className="bw-order__meta">
            Placed {formatDate(order.createdAt)}
            {items.length ? ` · ${items.length} ${pluralise(items.length, 'product')}` : ''}
          </p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </header>

      {items.length ? (
        <div className="bw-order__thumbs" aria-hidden="true">
          {items.slice(0, THUMBNAILS_SHOWN).map((item) => (
            <Image key={item.id} src={item.image} alt="" className="bw-order__thumb" />
          ))}
          {hiddenCount > 0 ? <span className="bw-order__more">+{hiddenCount}</span> : null}
        </div>
      ) : null}

      <OrderProgress status={order.orderStatus} />

      {items.length ? (
        <details className="bw-order__details">
          <summary>View items</summary>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="text-muted">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}
