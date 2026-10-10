import { needsAttention, ordersByStatus, ordersOverTime } from './analytics';

const NOW = new Date('2026-10-09T12:00:00');
const orders = [
  { createdAt: '2026-10-09T08:00:00', totalAmount: '100.50', orderStatus: 'processing' },
  { createdAt: '2026-10-09T09:00:00', totalAmount: 50, orderStatus: 'shipped' },
  { createdAt: '2026-10-01T09:00:00', totalAmount: 10 },
  { createdAt: '2025-01-01T00:00:00', totalAmount: 999 }, // outside the window
  { totalAmount: 5 }, // undated
];

describe('ordersOverTime', () => {
  const series = ordersOverTime(orders, 30, NOW);

  it('returns one point per day, oldest first, ending today', () => {
    expect(series).toHaveLength(30);
    expect(series[29]).toMatchObject({ orders: 2, value: 150.5 });
  });

  it('places older orders on their own day', () => {
    expect(series[21]).toMatchObject({ orders: 1, value: 10 });
  });

  it('ignores orders outside the window and orders with no date', () => {
    expect(series.reduce((total, day) => total + day.orders, 0)).toBe(3);
  });
});

describe('ordersByStatus', () => {
  it('counts by status, treating a missing status as processing', () => {
    expect(ordersByStatus(orders)).toEqual([
      { name: 'processing', value: 4 },
      { name: 'shipped', value: 1 },
    ]);
  });
});

describe('needsAttention', () => {
  it('flags processing and confirmed orders only', () => {
    expect(needsAttention({ orderStatus: 'processing' })).toBe(true);
    expect(needsAttention({ orderStatus: 'confirmed' })).toBe(true);
    expect(needsAttention({ orderStatus: 'shipped' })).toBe(false);
  });
});
