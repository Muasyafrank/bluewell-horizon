import { useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from './usePagedRows';
import { useApiResource } from './useApiResource';

const EMPTY = { items: [], total: 0, page: 1, pages: 1 };

/**
 * One page of a server-side list: `{ items, total, pages }` as sent by the API.
 *
 * `filters` (a search term, a status) are sent with every request and sending the
 * reader back to page 1 happens in the same render that the filter changes, so
 * there is no wasted request for a page that does not exist in the new result.
 * The returned `pager` has the same shape `TablePager` already understands.
 */
export function usePagedResource(fetcher, { filters = {}, deps = [], pageSize = PAGE_SIZE } = {}) {
  const filterKey = JSON.stringify(filters);
  const [state, setState] = useState({ key: filterKey, page: 1 });
  const page = state.key === filterKey ? state.page : 1;
  const setPage = (next) => setState({ key: filterKey, page: next });

  const resource = useApiResource(
    (options) => fetcher({ ...filters, page, pageSize }, options),
    { initialData: EMPTY, deps: [page, pageSize, filterKey, ...deps] },
  );

  const data = resource.data || EMPTY;
  const total = data.total || 0;
  const pageCount = Math.max(1, data.pages || 1);

  // Deleting the last row of the last page leaves an empty page: step back.
  useEffect(() => {
    if (!resource.loading && !resource.error && data.items.length === 0 && page > pageCount) {
      setState({ key: filterKey, page: pageCount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.loading, resource.error, data.items.length, page, pageCount]);

  const pager = useMemo(() => ({
    page, pageCount, setPage, total,
    from: total === 0 ? 0 : (page - 1) * pageSize + 1,
    to: Math.min(total, page * pageSize),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [page, pageCount, total, pageSize, filterKey]);

  return { rows: data.items, total, pager, loading: resource.loading, error: resource.error, reload: resource.reload };
}
