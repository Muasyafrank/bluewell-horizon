import { nextStock, stockLevel, summariseStock } from './stock';

describe('stockLevel', () => {
  it.each([
    [0, 'out'], [null, 'out'], [undefined, 'out'],
    [1, 'low'], [5, 'low'],
    [6, 'in'], ['12', 'in'],
  ])('classifies %p as %s', (stock, level) => {
    expect(stockLevel(stock)).toBe(level);
  });
});

describe('summariseStock', () => {
  it('counts products at each level', () => {
    expect(summariseStock([{ stock: 0 }, { stock: 3 }, { stock: 9 }, {}])).toEqual({
      total: 4, in: 1, low: 1, out: 2,
    });
  });
});

describe('nextStock', () => {
  it('adds, removes and sets', () => {
    expect(nextStock(10, 'add', '5')).toBe(15);
    expect(nextStock(10, 'remove', '3')).toBe(7);
    expect(nextStock(10, 'set', '3')).toBe(3);
  });

  it('never goes below zero', () => {
    expect(nextStock(10, 'remove', '25')).toBe(0);
  });

  it('treats a missing current stock as zero', () => {
    expect(nextStock(null, 'add', '4')).toBe(4);
  });

  it.each(['', '-1', '1.5', 'abc'])('rejects %p', (quantity) => {
    expect(nextStock(10, 'add', quantity)).toBeNull();
  });
});
