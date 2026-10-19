import { firstName, greetingFor, initials, progressIndex, summariseOrders } from './orderSummary';

describe('summariseOrders', () => {
  it('counts totals, in-progress and delivered orders', () => {
    const orders = [
      { orderStatus: 'processing' }, { orderStatus: 'quoted' }, { orderStatus: 'confirmed' }, { orderStatus: 'shipped' },
      { orderStatus: 'delivered' }, { orderStatus: 'delivered' }, { orderStatus: 'cancelled' },
      {},
    ];
    // The last order has no status, which means it is still being processed.
    expect(summariseOrders(orders)).toEqual({ total: 8, inProgress: 5, delivered: 2 });
  });

  it('handles no orders', () => {
    expect(summariseOrders([])).toEqual({ total: 0, inProgress: 0, delivered: 0 });
  });
});

describe('progressIndex', () => {
  it.each([['processing', 0], ['quoted', 1], ['Confirmed', 2], ['shipped', 3], ['delivered', 4], [undefined, 0]])(
    '%p -> %i', (status, index) => expect(progressIndex(status)).toBe(index),
  );

  it('is -1 for orders that are off the path', () => {
    expect(progressIndex('cancelled')).toBe(-1);
    expect(progressIndex('mystery')).toBe(-1);
  });
});

describe('initials and names', () => {
  it('builds initials from first and last name', () => {
    expect(initials('Francis Muasya')).toBe('FM');
    expect(initials('  anna  maria  de souza ')).toBe('AS');
    expect(initials('Francis')).toBe('F');
    expect(initials('')).toBe('?');
    expect(initials(null)).toBe('?');
  });

  it('takes the first name', () => {
    expect(firstName('Francis Muasya')).toBe('Francis');
    expect(firstName(undefined)).toBe('');
  });
});

describe('greetingFor', () => {
  it.each([[5, 'Good morning'], [11, 'Good morning'], [12, 'Good afternoon'], [16, 'Good afternoon'], [17, 'Good evening'], [23, 'Good evening']])(
    'at %i:00 -> %s', (hour, text) => expect(greetingFor(new Date(2026, 9, 10, hour))).toBe(text),
  );
});
