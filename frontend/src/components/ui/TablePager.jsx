import React from 'react';
import Pagination from './Pagination';

/** "Showing 26–50 of 130" with page buttons; renders nothing when everything fits on one page. */
export default function TablePager({ pager, label = 'Table pages' }) {
  if (!pager || pager.pageCount <= 1) return null;
  return (
    <div className="bw-table-pager">
      <span className="bw-table-pager__summary">Showing {pager.from}–{pager.to} of {pager.total}</span>
      <Pagination page={pager.page} pageCount={pager.pageCount} onChange={pager.setPage} label={label} />
    </div>
  );
}
