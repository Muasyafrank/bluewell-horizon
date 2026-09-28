import React from 'react';
import { FaStore, FaTruck } from 'react-icons/fa';
import { DELIVERY_METHODS, getDeliveryOption } from '../../utils/kenyanData';
import { formatCurrency } from '../../utils/format';

const ICONS = { standard: <FaTruck />, express: <FaTruck />, pickup: <FaStore /> };

/**
 * Delivery method picker.
 *
 * Previously three copy-pasted blocks of near-identical markup, each with its
 * own inline styles and a `<div>` wrapper that was styled as clickable but was
 * not actually a label — so clicking a card did not select its radio.
 */
export default function DeliveryOptions({ county, value, onChange }) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="h5 d-flex align-items-center gap-2 mb-4">
        <FaTruck aria-hidden="true" style={{ color: 'var(--bw-teal)' }} /> Delivery method
      </legend>

      <div className="row g-3">
        {DELIVERY_METHODS.map((method) => {
          const option = getDeliveryOption(county, method.value);
          const selected = value === method.value;

          return (
            <div className="col-md-4" key={method.value}>
              <label className={`bw-choice ${selected ? 'bw-choice--selected' : ''}`}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="deliveryMethod"
                  value={method.value}
                  checked={selected}
                  onChange={onChange}
                />
                <span className="d-block mb-2" aria-hidden="true" style={{ color: 'var(--bw-teal)', fontSize: '1.4rem' }}>
                  {ICONS[method.value]}
                </span>
                <strong className="d-block">{method.label}</strong>
                <small className="d-block text-muted">{option.eta}</small>
                <strong className="d-block mt-2 bw-price">
                  {option.fee === 0 ? 'Free' : formatCurrency(option.fee)}
                </strong>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
