import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../../components/layout';
import ModuleGate from './ModuleGate';
import StaffLayout from './StaffLayout';
import StaffLogin from './StaffLogin';
import { StaffProvider } from './StaffContext';
import CustomersPage from './pages/CustomersPage';
import DashboardPage from './pages/DashboardPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import InvoicesPage from './pages/InvoicesPage';
import PurchasingPage from './pages/PurchasingPage';
import ReportsPage from './pages/ReportsPage';
import StockPage from './pages/StockPage';
import SuppliersPage from './pages/SuppliersPage';
import TeamPage from './pages/TeamPage';

const gate = (module, element) => <ModuleGate module={module}>{element}</ModuleGate>;

/** The business management system, mounted at /staff. It has its own layout and shares nothing visual with the public site. */
export default function StaffApp() {
  return (
    <StaffProvider>
      <Routes>
        <Route path="login" element={<StaffLogin />} />
        <Route element={<RequireAuth audience="admin" loginPath="/staff/login"><StaffLayout /></RequireAuth>}>
          <Route index element={gate('dashboard', <DashboardPage />)} />
          <Route path="invoices" element={gate('invoices', <InvoicesPage />)} />
          <Route path="invoices/:id" element={gate('invoices', <InvoiceDetailPage />)} />
          <Route path="customers" element={gate('customers', <CustomersPage />)} />
          <Route path="stock" element={gate('stock', <StockPage />)} />
          <Route path="suppliers" element={gate('suppliers', <SuppliersPage />)} />
          <Route path="purchasing" element={gate('purchasing', <PurchasingPage />)} />
          <Route path="reports" element={gate('reports', <ReportsPage />)} />
          <Route path="team" element={gate('staff', <TeamPage />)} />
          <Route path="*" element={<Navigate to="/staff" replace />} />
        </Route>
      </Routes>
    </StaffProvider>
  );
}
