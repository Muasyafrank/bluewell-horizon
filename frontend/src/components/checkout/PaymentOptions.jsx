import React from 'react';
import { FaMobileAlt, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import Field from '../ui/Field';
import { BANK_DETAILS, MPESA_DETAILS } from '../../utils/kenyanData';
import { formatCurrency } from '../../utils/format';

/**
 * Payment method picker with per-method instructions.
 * The M-Pesa inputs used to sit inside the option's `<label>`, so clicking an
 * input re-toggled the radio and stole focus mid-typing. They now live outside
 * the label.
 */
export default function PaymentOptions({ values, errors, onChange, total }) {
  const selected = values.paymentMethod;

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="h5 mb-4">Payment method</legend>

      <div className={`bw-choice mb-3 ${selected === 'mpesa' ? 'bw-choice--selected' : ''}`}>
        <label className="d-flex align-items-center gap-3 mb-0">
          <input
            type="radio"
            name="paymentMethod"
            value="mpesa"
            checked={selected === 'mpesa'}
            onChange={onChange}
          />
          <span aria-hidden="true" style={{ color: '#3faf4a', fontSize: '1.4rem' }}>
            <FaMobileAlt />
          </span>
          <span>
            <strong className="d-block">M-Pesa</strong>
            <small className="text-muted">Pay by Paybill, then enter the confirmation code.</small>
          </span>
        </label>

        {selected === 'mpesa' ? (
          <div className="bw-choice__panel">
            <p className="small fw-semibold mb-2">How to pay</p>
            <ol className="small ps-3 mb-4" style={{ color: 'var(--bw-text-soft)' }}>
              <li>Open M-Pesa and choose Lipa na M-Pesa, then Paybill.</li>
              <li>
                Business number <strong>{MPESA_DETAILS.paybill}</strong>
              </li>
              <li>
                Account number <strong>{MPESA_DETAILS.accountHint}</strong>
              </li>
              <li>
                Amount <strong>{formatCurrency(total)}</strong>
              </li>
              <li>Enter your PIN and send, then copy the confirmation code below.</li>
            </ol>

            <div className="row g-3">
              <div className="col-md-6">
                <Field
                  label="M-Pesa phone number"
                  name="mpesaPhone"
                  type="tel"
                  value={values.mpesaPhone}
                  onChange={onChange}
                  error={errors.mpesaPhone}
                  placeholder="0712 345 678"
                  required
                  className="mb-0"
                />
              </div>
              <div className="col-md-6">
                <Field
                  label="M-Pesa confirmation code"
                  name="mpesaReference"
                  value={values.mpesaReference}
                  onChange={onChange}
                  error={errors.mpesaReference}
                  placeholder="QKL123ABC"
                  required
                  className="mb-0"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className={`bw-choice mb-3 ${selected === 'bank_transfer' ? 'bw-choice--selected' : ''}`}>
        <label className="d-flex align-items-center gap-3 mb-0">
          <input
            type="radio"
            name="paymentMethod"
            value="bank_transfer"
            checked={selected === 'bank_transfer'}
            onChange={onChange}
          />
          <span aria-hidden="true" style={{ color: 'var(--bw-teal)', fontSize: '1.4rem' }}>
            <FaUniversity />
          </span>
          <span>
            <strong className="d-block">Bank transfer</strong>
            <small className="text-muted">Deposit or transfer directly to our account.</small>
          </span>
        </label>

        {selected === 'bank_transfer' ? (
          <div className="bw-choice__panel">
            <dl className="row small mb-2" style={{ color: 'var(--bw-text-soft)' }}>
              <dt className="col-5">Bank</dt>
              <dd className="col-7">{BANK_DETAILS.bankName}</dd>
              <dt className="col-5">Account name</dt>
              <dd className="col-7">{BANK_DETAILS.accountName}</dd>
              <dt className="col-5">Account number</dt>
              <dd className="col-7">{BANK_DETAILS.accountNumber}</dd>
              <dt className="col-5">Branch</dt>
              <dd className="col-7">{BANK_DETAILS.branch}</dd>
              <dt className="col-5">Swift code</dt>
              <dd className="col-7 mb-0">{BANK_DETAILS.swiftCode}</dd>
            </dl>
            <p className="small text-muted mb-0">
              Quote your order number as the transfer reference so we can match the payment.
            </p>
          </div>
        ) : null}
      </div>

      <div className={`bw-choice ${selected === 'cod' ? 'bw-choice--selected' : ''}`}>
        <label className="d-flex align-items-center gap-3 mb-0">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={selected === 'cod'}
            onChange={onChange}
          />
          <span aria-hidden="true" style={{ color: 'var(--bw-teal)', fontSize: '1.4rem' }}>
            <FaMoneyBillWave />
          </span>
          <span>
            <strong className="d-block">Cash on delivery</strong>
            <small className="text-muted">Pay the driver on arrival. Nairobi deliveries only.</small>
          </span>
        </label>
      </div>
    </fieldset>
  );
}
