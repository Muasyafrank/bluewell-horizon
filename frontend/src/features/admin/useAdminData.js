import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi, catalogApi } from '../../api';

/**
 * Loads every collection the dashboard needs and exposes one `reload`.
 *
 * The previous version fetched eight endpoints with `Promise.all` and no
 * `.catch` at all — if any single request failed (an expired token, the
 * server briefly down) the whole dashboard threw and rendered nothing, with
 * no indication of which call failed or why.
 */
export function useAdminData(token) {
  const [state, setState] = useState({
    stats: {},
    products: [],
    services: [],
    gallery: [],
    technologies: [],
    processSteps: [],
    orders: [],
    contacts: [],
    quotes: [],
    companyInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  const load = useCallback(
    async (signal) => {
      // Only the first load shows the full-panel spinner. A reload after an
      // edit refreshes in the background, so the tab you are on does not
      // disappear and reappear every time you save something.
      if (!hasLoaded.current) setLoading(true);
      setError(null);
      try {
        const [
          stats, products, services, gallery, technologies, processSteps,
          orders, contacts, quotes, companyInfo,
        ] = await Promise.all([
          adminApi.stats({ token, signal }),
          catalogApi.listProducts({ signal }),
          catalogApi.listServices({ signal }),
          catalogApi.listGallery({ signal }),
          catalogApi.listTechnologies({ signal }),
          catalogApi.listProcessSteps({ signal }),
          adminApi.listOrders({ token, signal }),
          adminApi.listContacts({ token, signal }),
          adminApi.listQuotes({ token, signal }),
          catalogApi.getCompanyInfo({ signal }),
        ]);

        setState({
          stats: stats || {},
          products: products || [],
          services: services || [],
          gallery: gallery || [],
          technologies: technologies || [],
          processSteps: processSteps || [],
          orders: orders || [],
          contacts: contacts || [],
          quotes: quotes || [],
          companyInfo: companyInfo || {},
        });
        hasLoaded.current = true;
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { ...state, loading, error, reload: () => load() };
}
