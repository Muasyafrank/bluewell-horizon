import { act, renderHook, waitFor } from '@testing-library/react';
import { usePagedResource } from './usePagedResource';

const reply = (page, total = 60) => ({ items: [`row-${page}`], total, page, pageSize: 25, pages: Math.ceil(total / 25) });

describe('usePagedResource', () => {
  it('requests page 1 with the filters and exposes a pager', async () => {
    const fetcher = jest.fn().mockResolvedValue(reply(1));
    const { result } = renderHook(() => usePagedResource(fetcher, { filters: { q: 'acme' } }));
    await waitFor(() => expect(result.current.rows).toEqual(['row-1']));
    expect(fetcher.mock.calls[0][0]).toEqual({ q: 'acme', page: 1, pageSize: 25 });
    expect(result.current.pager).toMatchObject({ page: 1, pageCount: 3, total: 60, from: 1, to: 25 });
  });

  it('fetches the requested page', async () => {
    const fetcher = jest.fn((params) => Promise.resolve(reply(params.page)));
    const { result } = renderHook(() => usePagedResource(fetcher));
    await waitFor(() => expect(result.current.rows).toEqual(['row-1']));
    act(() => result.current.pager.setPage(3));
    await waitFor(() => expect(result.current.rows).toEqual(['row-3']));
    expect(result.current.pager).toMatchObject({ page: 3, from: 51, to: 60 });
  });

  it('returns to page 1 as soon as a filter changes, without asking for the old page', async () => {
    const fetcher = jest.fn((params) => Promise.resolve(reply(params.page)));
    const { result, rerender } = renderHook(({ q }) => usePagedResource(fetcher, { filters: { q } }), {
      initialProps: { q: '' },
    });
    await waitFor(() => expect(result.current.rows).toEqual(['row-1']));
    act(() => result.current.pager.setPage(2));
    await waitFor(() => expect(result.current.rows).toEqual(['row-2']));
    fetcher.mockClear();
    rerender({ q: 'beta' });
    await waitFor(() => expect(fetcher).toHaveBeenCalled());
    expect(fetcher.mock.calls.every(([params]) => params.page === 1 && params.q === 'beta')).toBe(true);
  });

  it('steps back when the current page has emptied', async () => {
    const fetcher = jest.fn((params) => Promise.resolve(
      params.page === 2 ? { items: [], total: 25, page: 2, pageSize: 25, pages: 1 } : reply(1, 25),
    ));
    const { result } = renderHook(() => usePagedResource(fetcher));
    await waitFor(() => expect(result.current.rows).toEqual(['row-1']));
    act(() => result.current.pager.setPage(2));
    await waitFor(() => expect(result.current.pager.page).toBe(1));
  });
});
