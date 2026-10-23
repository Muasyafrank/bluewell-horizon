"""
A small in-memory rate limiter for the endpoints a stranger can hammer: sign-in,
registration, checkout and the public forms.

It keeps a sliding window of timestamps per (rule, client address), so one
visitor cannot try thousands of passwords or flood the inbox with enquiries.
State lives in the process, which is right for a single server process; with
several workers each keeps its own count (limits are then per worker). Behind a
reverse proxy set TRUST_PROXY=true so the real client address is read from
X-Forwarded-For instead of the proxy's.
"""
import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status

from config import settings

_hits: dict[tuple[str, str], deque] = defaultdict(deque)
_lock = threading.Lock()
_last_sweep = 0.0
SWEEP_EVERY_SECONDS = 300


def client_ip(request: Request) -> str:
    if settings.trust_proxy:
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def reset() -> None:
    """Forgets every count (used by the tests)."""
    with _lock:
        _hits.clear()


def _sweep(now: float, longest_window: float) -> None:
    """Drops idle clients so the table cannot grow without bound."""
    global _last_sweep
    if now - _last_sweep < SWEEP_EVERY_SECONDS:
        return
    _last_sweep = now
    for key in [k for k, q in _hits.items() if not q or now - q[-1] > longest_window]:
        del _hits[key]


def rate_limit(name: str, limit: int, window_seconds: int):
    """Dependency: allow `limit` requests per `window_seconds` per client for rule `name`."""
    def dependency(request: Request) -> None:
        if not settings.rate_limit_enabled:
            return
        now = time.monotonic()
        key = (name, client_ip(request))
        with _lock:
            _sweep(now, window_seconds)
            hits = _hits[key]
            while hits and now - hits[0] > window_seconds:
                hits.popleft()
            if len(hits) >= limit:
                retry_after = max(1, int(window_seconds - (now - hits[0])))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many attempts. Please wait a few minutes and try again.",
                    headers={"Retry-After": str(retry_after)},
                )
            hits.append(now)
    return dependency
