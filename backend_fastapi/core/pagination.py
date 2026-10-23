"""
Paging for list endpoints.

A list that grows with the business (invoices, purchase orders, customers) is
returned one page at a time as `{items, total, page, pageSize, pages}`, so the
response stays small however many records exist. Search and status filters run
in the database for the same reason.

The few lists that the old dashboard still reads whole (orders, enquiries,
quotes) are capped at MAX_ADMIN_ROWS newest rows instead, so they cannot grow
without bound either.
"""
import math
from dataclasses import dataclass

from fastapi import Query

DEFAULT_PAGE_SIZE = 25
MAX_PAGE_SIZE = 100
MAX_ADMIN_ROWS = 1000


@dataclass(frozen=True)
class PageParams:
    page: int
    page_size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


def page_params(
    page: int = Query(1, ge=1, le=100_000),
    page_size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, alias="pageSize"),
) -> PageParams:
    return PageParams(page=page, page_size=page_size)


def envelope(items: list, total: int, params: PageParams) -> dict:
    return {
        "items": items,
        "total": total,
        "page": params.page,
        "pageSize": params.page_size,
        "pages": max(1, math.ceil(total / params.page_size)),
    }


def paginate_query(query, params: PageParams, serialise) -> dict:
    """One page of an ordered SQLAlchemy query, run through `serialise`."""
    total = query.order_by(None).count()
    rows = query.offset(params.offset).limit(params.page_size).all()
    return envelope([serialise(row) for row in rows], total, params)


def paginate_list(rows: list, params: PageParams) -> dict:
    """One page of rows already in memory (the customer roll-up is built in Python)."""
    return envelope(rows[params.offset:params.offset + params.page_size], len(rows), params)


def like_pattern(text: str) -> str:
    """`%text%` for LIKE with the user's own % and _ treated as plain characters."""
    escaped = text.strip().lower().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"
