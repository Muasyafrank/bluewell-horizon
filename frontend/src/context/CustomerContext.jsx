import { createAuthContext } from './createAuthContext';

const { Provider, useAuth } = createAuthContext({
  tokenKey: 'bluewell.customerToken',
  userKey: 'bluewell.customer',
  name: 'Customer',
});

export const CustomerProvider = Provider;
export const useCustomer = useAuth;
