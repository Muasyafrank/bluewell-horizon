import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { adminApi } from '../../../api';
import { Alert, Button, Field, Modal } from '../../../components/ui';
import { formatCurrency, formatDateTime } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import '../../../styles/admin-quotation.css';
import { blankLine, computeTotals, initialForm, toRequest, validateForm } from '../quotation';

/**
 * Prepare a quotation for an order and email it to the customer.
 *
 * The admin prices each line, chooses which payment methods to offer and sends
 * it. The server recomputes every figure, so the totals shown here are only a
 * live preview.
 */
export default function QuotationModal({ order, token, onClose, onChanged }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState('');
  const [problem, setProblem] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getQuotation(order.id, { token })
      .then((response) => {
        if (cancelled) return;
        setData(response);
        setForm(initialForm(response));
      })
      .catch((error) => !cancelled && setLoadError(error.message));
    return () => {
      cancelled = true;
    };
  }, [order.id, token]);

  const totals = useMemo(
    () => (form ? computeTotals(form.lines, form.deliveryFee, form.includeVat) : null),
    [form],
  );

  const change = (patch) => {
    setProblem('');
    setForm((current) => ({ ...current, ...patch }));
  };
  const changeLine = (index, patch) =>
    change({ lines: form.lines.map((line, i) => (i === index ? { ...line, ...patch } : line)) });
  const toggleMethod = (key) =>
    change({
      paymentMethods: form.paymentMethods.includes(key)
        ? form.paymentMethods.filter((value) => value !== key)
        : [...form.paymentMethods, key],
    });

  // Runs one of save / preview / send, with the form checked first.
  const run = async (name, action) => {
    const message = validateForm(form);
    if (message) {
      setProblem(message);
      return;
    }
    setBusy(name);
    try {
      await action(toRequest(form));
    } catch (error) {
      setProblem(error.message);
      toastError(error.message);
    } finally {
      setBusy('');
    }
  };

  const saveDraft = () =>
    run('save', async (body) => {
      const { quotation } = await adminApi.saveQuotation(order.id, body, { token });
      setData((current) => ({ ...current, quotation }));
      toastSuccess('Draft saved');
      onChanged();
    });

  const showPreview = () =>
    run('preview', async (body) => setPreview(await adminApi.previewQuotation(order.id, body, { token })));

  const send = () =>
    run('send', async (body) => {
      const response = await adminApi.sendQuotation(order.id, body, { token });
      toastSuccess(response.message);
      onChanged();
      onClose();
    });

  const saved = data?.quotation;
  const methods = data?.paymentMethods || [];
  const canSend = data?.emailConfigured;

  return (
    <>
      <Modal
        open
        onClose={onClose}
        size="xl"
        title={`Quotation for ${order.orderNumber}`}
        footer={
          form ? (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button variant="outline" onClick={saveDraft} loading={busy === 'save'} disabled={Boolean(busy)}>
                Save draft
              </Button>
              <Button variant="outline" onClick={showPreview} loading={busy === 'preview'} disabled={Boolean(busy)}>
                Preview email
              </Button>
              <Button onClick={send} loading={busy === 'send'} loadingText="Sending" disabled={Boolean(busy) || !canSend}>
                {saved?.status === 'sent' ? 'Send again' : 'Send quotation'}
              </Button>
            </>
          ) : null
        }
      >
        {loadError ? <Alert tone="danger">{loadError}</Alert> : null}
        {!form && !loadError ? <p className="text-muted mb-0">Loading…</p> : null}

        {form ? (
          <div className="d-flex flex-column gap-4">
            <p className="mb-0 text-muted">
              For <strong>{order.customerName}</strong>, {order.customerEmail}. The quotation is emailed to this
              address with the payment details below.
            </p>

            {saved?.status === 'sent' ? (
              <Alert tone="success">
                Sent {formatDateTime(saved.sentAt)} as {saved.quoteNumber}. Changing anything and sending again
                replaces it.
              </Alert>
            ) : null}
            {!canSend ? (
              <Alert tone="danger">
                Email is not set up on the server (EMAIL_USER and EMAIL_PASS), so quotations cannot be sent yet.
                You can still save a draft.
              </Alert>
            ) : null}

            <section aria-labelledby="quote-items">
              <h3 className="h6 mb-3" id="quote-items">Items</h3>
              <div className="bw-quote-lines">
                <div className="bw-quote-lines__head" aria-hidden="true">
                  <span>Description</span><span>Qty</span><span>Unit price (KES)</span><span>Amount</span><span />
                </div>
                {form.lines.map((line, index) => (
                  <div className="bw-quote-lines__row" key={index}>
                    <input
                      className="bw-field__control"
                      aria-label={`Item ${index + 1} description`}
                      value={line.description}
                      maxLength={200}
                      onChange={(event) => changeLine(index, { description: event.target.value })}
                    />
                    <input
                      className="bw-field__control"
                      aria-label={`Item ${index + 1} quantity`}
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(event) => changeLine(index, { quantity: event.target.value })}
                    />
                    <input
                      className="bw-field__control"
                      aria-label={`Item ${index + 1} unit price`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(event) => changeLine(index, { unitPrice: event.target.value })}
                    />
                    <span className="bw-quote-lines__amount">
                      {formatCurrency((Number(line.unitPrice) || 0) * (parseInt(line.quantity, 10) || 0))}
                    </span>
                    <button
                      type="button"
                      className="bw-icon-btn bw-icon-btn--danger"
                      aria-label={`Remove item ${index + 1}`}
                      disabled={form.lines.length === 1}
                      onClick={() => change({ lines: form.lines.filter((_, i) => i !== index) })}
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                icon={<FaPlus size={11} aria-hidden="true" />}
                onClick={() => change({ lines: [...form.lines, blankLine()] })}
              >
                Add item
              </Button>
            </section>

            <div className="row g-3">
              <div className="col-md-4">
                <Field
                  label="Delivery (KES)"
                  name="deliveryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.deliveryFee}
                  onChange={(event) => change({ deliveryFee: event.target.value })}
                  optional
                  className="mb-0"
                />
              </div>
              <div className="col-md-4">
                <Field
                  label="Valid until"
                  name="validUntil"
                  type="date"
                  value={form.validUntil}
                  onChange={(event) => change({ validUntil: event.target.value })}
                  required
                  className="mb-0"
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <label className="form-check d-flex align-items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={form.includeVat}
                    onChange={(event) => change({ includeVat: event.target.checked })}
                  />
                  <span>Add 16% VAT</span>
                </label>
              </div>
            </div>

            <dl className="bw-quote-totals">
              <div><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
              {totals.deliveryFee > 0 ? <div><dt>Delivery</dt><dd>{formatCurrency(totals.deliveryFee)}</dd></div> : null}
              {form.includeVat ? <div><dt>VAT (16%)</dt><dd>{formatCurrency(totals.vatAmount)}</dd></div> : null}
              <div className="bw-quote-totals__total"><dt>Total</dt><dd>{formatCurrency(totals.totalAmount)}</dd></div>
            </dl>

            <fieldset>
              <legend className="h6 mb-2">Payment methods to offer</legend>
              <p className="small text-muted">
                Their details appear in the email, with the order number as the payment reference.
                Set up more methods in the server's .env file.
              </p>
              <div className="row g-3">
                {methods.map((method) => (
                  <div className="col-md-6" key={method.key}>
                    <label className="bw-quote-method">
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        checked={form.paymentMethods.includes(method.key)}
                        onChange={() => toggleMethod(method.key)}
                      />
                      <span>
                        <strong className="d-block">{method.label}</strong>
                        {method.details.map(([label, value]) => (
                          <span className="d-block small text-muted" key={label}>
                            {label}: {value}
                          </span>
                        ))}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <Field
              label="Note to the customer"
              name="notes"
              as="textarea"
              rows={3}
              maxLength={1000}
              value={form.notes}
              onChange={(event) => change({ notes: event.target.value })}
              placeholder="Delivery time, installation, warranty, anything the customer should know."
              optional
              className="mb-0"
            />

            {problem ? <Alert tone="danger">{problem}</Alert> : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        size="lg"
        title={preview?.subject || 'Preview'}
        footer={<Button variant="outline" onClick={() => setPreview(null)}>Close preview</Button>}
      >
        {preview ? (
          <iframe
            title="Quotation email preview"
            className="bw-quote-preview"
            sandbox=""
            srcDoc={preview.html}
          />
        ) : null}
      </Modal>
    </>
  );
}
