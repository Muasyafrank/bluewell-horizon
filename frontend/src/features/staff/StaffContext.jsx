import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { bmsApi } from '../../api';
import { useAdmin } from '../../context/AdminContext';

const Context = createContext(null);

/**
 * Who is signed in to the staff app and what their role allows.
 * The token is the same one the website's admin sign-in stores; the server
 * decides the modules, so the menu can never offer more than the API allows.
 */
export function StaffProvider({ children }) {
  const { token, logout } = useAdmin();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setMe(null);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    bmsApi
      .me({ token, signal: controller.signal })
      .then(setMe)
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (err.isUnauthorized) logout();
        else setError(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [token, logout]);

  const can = useCallback((module) => Boolean(me?.modules?.includes(module)), [me]);
  const value = useMemo(() => ({ me, token, loading, error, can, logout }), [me, token, loading, error, can, logout]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useStaff() {
  const value = useContext(Context);
  if (!value) throw new Error('useStaff must be used inside StaffProvider');
  return value;
}
