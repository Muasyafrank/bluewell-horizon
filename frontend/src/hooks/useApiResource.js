import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads data from the API and tracks loading and error state.
 *
 * Pages previously called `fetch(...).then(setState)` with no `.catch`, so a
 * server that was down produced an unhandled rejection and a page stuck on an
 * empty list with no explanation. This hook gives every screen a consistent
 * loading / error / retry cycle and aborts in-flight requests on unmount.
 *
 * @param {(options: { signal: AbortSignal }) => Promise<any>} fetcher
 * @param {object} [config]
 * @param {any}    [config.initialData]
 * @param {any[]}  [config.deps]      Re-fetch when these change.
 * @param {boolean}[config.enabled]   Skip the request when false.
 */
export function useApiResource(fetcher, { initialData = null, deps = [], enabled = true } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  const [reloadToken, setReloadToken] = useState(0);

  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetcherRef
      .current({ signal: controller.signal })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (!active || err.name === 'AbortError') return;
        setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, reloadToken, ...deps]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { data, loading, error, reload, setData };
}
