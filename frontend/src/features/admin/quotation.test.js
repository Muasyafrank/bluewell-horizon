import { computeTotals, defaultValidUntil, initialForm, toRequest, validateForm } from './quotation';

const today = new Date(2026, 9, 16); // 16 October 2026

describe('computeTotals', () => {
  it('adds VAT on goods and delivery together', () => {
    const lines = [{ quantity: '2', unitPrice: '100000' }];
    expect(computeTotals(lines, '5000', true)).toEqual({
      subtotal: 200000, deliveryFee: 5000, vatAmount: 32800, totalAmount: 237800,
    });
  });

  it('leaves VAT out when asked', () => {
    expect(computeTotals([{ quantity: '1', unitPrice: '1500.50' }], '', false).totalAmount).toBe(1500.5);
  });

  it('treats blanks as zero rather than NaN', () => {
    expect(computeTotals([{ quantity: '', unitPrice: '' }], '', true).totalAmount).toBe(0);
  });
});

describe('defaultValidUntil', () => {
  it('counts days forward across month ends', () => {
    expect(defaultValidUntil(14, today)).toBe('2026-10-30');
    expect(defaultValidUntil(20, today)).toBe('2026-11-05');
  });
});

describe('initialForm', () => {
  const methods = [{ key: 'mpesa_paybill' }, { key: 'cash_on_delivery' }];

  it('starts from the ordered items with blank prices and every method ticked', () => {
    const form = initialForm(
      { quotation: null, suggestedLines: [{ description: 'Filter', quantity: 2, unitPrice: null }], paymentMethods: methods, deliveryFee: 0 },
      today,
    );
    expect(form.lines).toEqual([{ description: 'Filter', quantity: '2', unitPrice: '' }]);
    expect(form.paymentMethods).toEqual(['mpesa_paybill', 'cash_on_delivery']);
    expect(form.validUntil).toBe('2026-10-30');
  });

  it('reloads a saved quotation and drops payment methods that are no longer set up', () => {
    const form = initialForm({
      quotation: {
        lines: [{ description: 'RO', quantity: 1, unitPrice: 5000 }], deliveryFee: 0, includeVat: false,
        validUntil: '2026-11-01', paymentMethods: ['mpesa_paybill', 'bank_transfer'], notes: 'Hi',
      },
      paymentMethods: methods,
    });
    expect(form.paymentMethods).toEqual(['mpesa_paybill']);
    expect(form.includeVat).toBe(false);
    expect(form.notes).toBe('Hi');
  });
});

describe('validateForm', () => {
  const good = {
    lines: [{ description: 'RO', quantity: '1', unitPrice: '5000' }],
    deliveryFee: '', includeVat: true, validUntil: '2026-10-30', paymentMethods: ['cash_on_delivery'], notes: '',
  };

  it('accepts a complete form', () => expect(validateForm(good, today)).toBeNull());

  it.each([
    [{ lines: [] }, 'Add at least one item.'],
    [{ lines: [{ description: ' ', quantity: '1', unitPrice: '5' }] }, 'Item 1 needs a description.'],
    [{ lines: [{ description: 'RO', quantity: '0', unitPrice: '5' }] }, 'Item 1 needs a quantity of 1 or more.'],
    [{ lines: [{ description: 'RO', quantity: '1', unitPrice: '' }] }, 'Item 1 needs a unit price.'],
    [{ validUntil: '2026-10-15' }, 'The valid-until date is in the past.'],
    [{ paymentMethods: [] }, 'Choose at least one payment method.'],
  ])('rejects %j', (change, message) => expect(validateForm({ ...good, ...change }, today)).toBe(message));
});

describe('toRequest', () => {
  it('sends numbers and a null for empty notes', () => {
    const body = toRequest({
      lines: [{ description: ' RO ', quantity: '2', unitPrice: '100.5' }],
      deliveryFee: '', includeVat: true, validUntil: '2026-10-30', paymentMethods: ['mpesa_paybill'], notes: ' ',
    });
    expect(body).toEqual({
      lines: [{ description: 'RO', quantity: 2, unitPrice: 100.5 }],
      deliveryFee: 0, includeVat: true, validUntil: '2026-10-30', paymentMethods: ['mpesa_paybill'], notes: null,
    });
  });
});
