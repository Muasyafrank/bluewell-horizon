import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Builds an authentication context backed by localStorage.
 *
 * The admin and customer contexts were near-identical copies of each other,
 * and both read their token in an effect *after* the first render — so a
 * protected route saw `isAuthenticated === false` on mount and redirected a
 * signed-in user to the login page on every hard refresh. Reading the stored
 * session during the initial state calculation removes that flash.
 */
export function createAuthContext({ tokenKey, userKey, name }) {
  const Context = createContext(null);

  function readStored(key, parse = false) {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    if (!parse) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      window.localStorage.removeItem(key);
      return null;
    }
  }

  function Provider({ children }) {
    const [token, setToken] = useState(() => readStored(tokenKey));
    const [user, setUser] = useState(() => (userKey ? readStored(userKey, true) : null));

    const login = useCallback((newToken, profile = null) => {
      window.localStorage.setItem(tokenKey, newToken);
      if (userKey && profile) window.localStorage.setItem(userKey, JSON.stringify(profile));
      setToken(newToken);
      setUser(profile);
    }, []);

    const logout = useCallback(() => {
      window.localStorage.removeItem(tokenKey);
      if (userKey) window.localStorage.removeItem(userKey);
      setToken(null);
      setUser(null);
    }, []);

    const value = useMemo(
      () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
      [token, user, login, logout],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useAuth() {
    const context = useContext(Context);
    if (!context) throw new Error(`use${name} must be used inside its provider`);
    return context;
  }

  return { Provider, useAuth, Context };
}
