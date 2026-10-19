import { toPoRequest, validatePo } from './purchaseForm';

const form = () => ({ supplierId: '3', expectedOn: '', notes: ' ', lines: [{ productId: '7', quantity: '5', unitCost: '120.5' }] });

test('a purchase order needs a supplier and complete lines', () => {
  expect(validatePo({ ...form(), supplierId: '' })).toMatch(/supplier/i);
  expect(validatePo({ ...form(), lines: [{ productId: '', quantity: '1', unitCost: '1' }] })).toMatch(/every line/i);
  expect(validatePo({ ...form(), lines: [{ productId: '7', quantity: '0', unitCost: '1' }] })).toMatch(/every line/i);
  expect(validatePo(form())).toBeNull();
});

test('the request uses numbers and nulls for blanks', () => {
  expect(toPoRequest(form())).toEqual({
    supplierId: 3, expectedOn: null, notes: null, lines: [{ productId: 7, quantity: 5, unitCost: 120.5 }],
  });
});
