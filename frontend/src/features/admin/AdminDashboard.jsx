import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBox, FaBuilding, FaChartLine, FaConciergeBell, FaEnvelope, FaImages,
  FaMicroscope, FaProjectDiagram, FaShoppingCart, FaSignOutAlt, FaClipboardList,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { SEO } from '../../components/common';
import { AsyncSection, Button } from '../../components/ui';
import { useAdminData } from './useAdminData';
import StatCards from './StatCards';
import OverviewPanel from './panels/OverviewPanel';
import OrdersPanel from './panels/OrdersPanel';
import InquiriesPanel from './panels/InquiriesPanel';
import QuotesPanel from './panels/QuotesPanel';
import CompanyPanel from './panels/CompanyPanel';
import ContentPanel from './panels/ContentPanel';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
  { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
  { id: 'inquiries', label: 'Inquiries', icon: <FaEnvelope /> },
  { id: 'quotes', label: 'Quotes', icon: <FaClipboardList /> },
  { id: 'company', label: 'Company info', icon: <FaBuilding /> },
  { id: 'services', label: 'Services', icon: <FaConciergeBell /> },
  { id: 'technologies', label: 'Technologies', icon: <FaMicroscope /> },
  { id: 'process', label: 'Process steps', icon: <FaProjectDiagram /> },
  { id: 'products', label: 'Products', icon: <FaBox /> },
  { id: 'gallery', label: 'Gallery', icon: <FaImages /> },
];

/**
 * Admin dashboard shell.
 *
 * This used to be one 960-line file that declared its modals and helper
 * components inside the function body (see ContentFormModal's note on why
 * that broke input focus), duplicated the same CRUD fetch pattern nine times,
 * and had no error handling if any of its eight startup requests failed. It
 * is now a tab shell over `useAdminData` and the panel components above.
 */
export default function AdminDashboard() {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const data = useAdminData(token);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const panel = {
    overview: <OverviewPanel orders={data.orders} contacts={data.contacts} />,
    orders: <OrdersPanel orders={data.orders} token={token} onChanged={data.reload} />,
    inquiries: <InquiriesPanel contacts={data.contacts} token={token} onChanged={data.reload} />,
    quotes: <QuotesPanel quotes={data.quotes} />,
    company: <CompanyPanel companyInfo={data.companyInfo} token={token} onChanged={data.reload} />,
    services: <ContentPanel type="service" items={data.services} token={token} onChanged={data.reload} />,
    technologies: <ContentPanel type="technology" items={data.technologies} token={token} onChanged={data.reload} />,
    process: <ContentPanel type="process" items={data.processSteps} token={token} onChanged={data.reload} />,
    products: <ContentPanel type="product" items={data.products} token={token} onChanged={data.reload} />,
    gallery: <ContentPanel type="gallery" items={data.gallery} token={token} onChanged={data.reload} />,
  }[activeTab];

  return (
    <>
      <SEO title="Admin dashboard" path="/admin/dashboard" noIndex />

      <div className="bw-page bw-section bw-section--tint">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Admin dashboard</h1>
            <Button variant="danger" icon={<FaSignOutAlt aria-hidden="true" />} onClick={handleLogout}>
              Sign out
            </Button>
          </div>

          <StatCards stats={data.stats} />

          <ul className="bw-tabs" role="tablist" aria-label="Dashboard sections">
            {TABS.map((tab) => (
              <li key={tab.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  className="bw-tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span aria-hidden="true">{tab.icon}</span> {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="bw-card">
            <AsyncSection
              loading={data.loading}
              error={data.error}
              onRetry={data.reload}
              loadingText="Loading dashboard data"
            >
              {panel}
            </AsyncSection>
          </div>
        </div>
      </div>
    </>
  );
}
