import React from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import Badge from '../ui/Badge';
import IconButton from '../ui/IconButton';
import Image from '../common/Image';

/** One line of the cart: image, name, quantity stepper, remove. No pricing. */
export default function CartLine({ item, maxQuantity, onSetQuantity, onRemove }) {
  return (
    <li className="bw-card bw-cart-line d-flex flex-wrap align-items-center gap-4">
      <Image src={item.image} alt={item.name} className="bw-thumb" />

      <div className="flex-grow-1" style={{ minWidth: '12rem' }}>
        {item.category ? <Badge className="mb-2">{item.category}</Badge> : null}
        <h3 className="h6 mb-0">{item.name}</h3>
      </div>

      <div className="d-flex flex-column align-items-center gap-2">
        <div className="bw-quantity">
          <IconButton
            label={`Reduce quantity of ${item.name}`}
            icon={<FaMinus size={10} />}
            onClick={() => onSetQuantity(item.id, item.quantity - 1)}
          />
          <span className="bw-quantity__value" aria-live="polite">
            {item.quantity}
          </span>
          <IconButton
            label={`Increase quantity of ${item.name}`}
            icon={<FaPlus size={10} />}
            variant="solid"
            disabled={item.quantity >= maxQuantity}
            onClick={() => onSetQuantity(item.id, item.quantity + 1)}
          />
        </div>
        <button
          type="button"
          className="bw-nav-link bw-nav-link--danger p-1"
          style={{ color: 'var(--bw-danger)', fontSize: '0.8125rem' }}
          onClick={() => onRemove(item)}
        >
          <FaTrash size={11} aria-hidden="true" /> Remove
        </button>
      </div>
    </li>
  );
}