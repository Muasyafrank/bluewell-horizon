import React, { useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/** Builds a compact page list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 12. */
function buildPageList(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

/**
 * Numbered pagination with previous/next controls.
 * Renders nothing when there is only one page.
 */
export default function Pagination({ page, pageCount, onChange }) {
  const pages = useMemo(() => buildPageList(page, pageCount), [page, pageCount]);

  if (pageCount <= 1) return null;

  const go = (target) => {
    if (target < 1 || target > pageCount || target === page) return;
    onChange(target);
  };

  let previous = 0;

  return (
    <nav className="bw-pagination" aria-label="Product pages">
      <button
        type="button"
        className="bw-pagination__item"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft size={10} aria-hidden="true" />
      </button>

      {pages.map((pageNumber) => {
        const showEllipsis = pageNumber - previous > 1;
        previous = pageNumber;
        return (
          <React.Fragment key={pageNumber}>
            {showEllipsis ? <span className="bw-pagination__item" style={{ border: 'none', cursor: 'default' }}>…</span> : null}
            <button
              type="button"
              className="bw-pagination__item"
              aria-current={pageNumber === page}
              onClick={() => go(pageNumber)}
            >
              {pageNumber}
            </button>
          </React.Fragment>
        );
      })}

      <button
        type="button"
        className="bw-pagination__item"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <FaChevronRight size={10} aria-hidden="true" />
      </button>
    </nav>
  );
}
