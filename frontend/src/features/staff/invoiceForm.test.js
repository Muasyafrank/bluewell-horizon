import { blankInvoice, invoiceTotals, toInvoiceRequest, validateInvoice } from './invoiceForm';

const filled = () => ({
  ...blankInvoice(), customerName: ' Acme Ltd ', customerEmail: '',
  lines: [{ description: ' Service call ', quantity: '2', unitPrice: '1000' }],
});

test('a blank invoice reports what is missing', () => {
  const errors = validateInvoice(blankInvoice());
  expect(errors.customerName).toBeTruthy();
  expect(errors.lines[0].description).toBeTruthy();
  expect(errors.lines[0].unitPrice).toBeTruthy();
});

test('a complete invoice passes and an email is optional', () => {
  expect(validateInvoice(filled())).toEqual({});
  expect(validateInvoice({ ...filled(), customerEmail: 'nope' }).customerEmail).toBeTruthy();
});

test('the request is trimmed, typed and sends empty optionals as null', () => {
  const body = toInvoiceRequest(filled());
  expect(body.customerName).toBe('Acme Ltd');
  expect(body.customerEmail).toBeNull();
  expect(body.lines).toEqual([{ description: 'Service call', quantity: 2, unitPrice: 1000 }]);
  expect(body.deliveryFee).toBe(0);
});

test('totals add VAT on goods and delivery', () => {
  const totals = invoiceTotals({ ...filled(), deliveryFee: '500' });
  expect(totals.subtotal).toBe(2000);
  expect(totals.vatAmount).toBe(400);
  expect(totals.totalAmount).toBe(2900);
});
