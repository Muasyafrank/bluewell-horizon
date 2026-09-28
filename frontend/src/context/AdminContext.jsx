import { createAuthContext } from './createAuthContext';

const { Provider, useAuth } = createAuthContext({
  tokenKey: 'bluewell.adminToken',
  name: 'Admin',
});

export const AdminProvider = Provider;
export const useAdmin = useAuth;
