import React, { createContext, useState, useEffect, useContext } from 'react';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('customerToken');
    const savedCustomer = localStorage.getItem('customerData');
    if (savedToken && savedCustomer) {
      setToken(savedToken);
      setCustomer(JSON.parse(savedCustomer));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newToken, customerData) => {
    localStorage.setItem('customerToken', newToken);
    localStorage.setItem('customerData', JSON.stringify(customerData));
    setToken(newToken);
    setCustomer(customerData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    setToken(null);
    setCustomer(null);
    setIsAuthenticated(false);
  };

  return (
    <CustomerContext.Provider value={{ isAuthenticated, token, customer, login, logout }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);