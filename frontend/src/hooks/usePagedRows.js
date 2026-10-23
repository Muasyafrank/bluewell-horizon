import { useEffect, useMemo, useState } from 'react';

export const PAGE_SIZE = 25;

/**
 * Splits a list into pages for display. The page number is clamped, so when a
 * search or a deletion leaves fewer pages the view never lands on an empty one,
 * and `resetKey` (a search term, say) sends the reader back to page 1.
 */
export function usePagedRows(rows, { pageSize = PAGE_SIZE, resetKey } = {}) {
  const [requested, setPage] = useState(1);
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requested), pageCount);

  useEffect(() => { setPage(1); }, [resetKey]);

  const visible = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return { visible, page, pageCount, setPage, total, from, to };
}
