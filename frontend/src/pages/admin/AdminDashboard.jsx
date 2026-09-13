import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { toastSuccess, toastError } from '../../utils/toast';
import {
  FaSignOutAlt, FaBox, FaConciergeBell, FaImages, FaTrash, FaPlus,
  FaMicroscope, FaProjectDiagram, FaEye, FaEdit, FaUpload, FaSpinner,
  FaShoppingCart, FaEnvelope, FaChartLine, FaMoneyBillWave, FaClock,
  FaCheckCircle, FaTimesCircle, FaTruck, FaPhone, FaUser, FaCalendar,
  FaBuilding
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data States
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [infoFormData, setInfoFormData] = useState({});

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const getEndpoint = (type) => type === 'process' ? 'process-steps' : `${type}s`;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchStats(), fetchData()]);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', { headers });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchData = async () => {
    const [pRes, sRes, gRes, tRes, psRes, oRes, cRes, infoRes] = await Promise.all([
      fetch('http://localhost:5000/api/products'),
      fetch('http://localhost:5000/api/services'),
      fetch('http://localhost:5000/api/gallery'),
      fetch('http://localhost:5000/api/technologies'),
      fetch('http://localhost:5000/api/process-steps'),
      fetch('http://localhost:5000/api/admin/orders', { headers }),
      fetch('http://localhost:5000/api/admin/contacts', { headers }),
      fetch('http://localhost:5000/api/company-info')
    ]);
    setProducts(await pRes.json());
    setServices(await sRes.json());
    setGallery(await gRes.json());
    setTechnologies(await tRes.json());
    setProcessSteps(await psRes.json());
    setOrders(await oRes.json());
    setContacts(await cRes.json());
    
    // FIXED: Parse response once, then use the data twice
    const companyData = await infoRes.json();
    setCompanyInfo(companyData);
    setInfoFormData(companyData);
  };

  // --- ORDER MANAGEMENT ---
  const handleViewOrder = async (order) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${order.id}`, { headers });
      const data = await res.json();
      setSelectedOrder(data);
      setShowOrderModal(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder({ order });
    setNewStatus(order.orderStatus);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${selectedOrder.order.id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      setShowStatusModal(false);
      fetchData();
      fetchStats();
    } catch (err) {
      toastError('Error updating status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    await fetch(`http://localhost:5000/api/admin/orders/${id}`, { method: 'DELETE', headers });
    fetchData();
    fetchStats();
  };

  // --- CONTACT MANAGEMENT ---
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
    if (!contact.isRead) {
      fetch(`http://localhost:5000/api/admin/contacts/${contact.id}/read`, { method: 'PUT', headers });
      fetchStats();
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    await fetch(`http://localhost:5000/api/admin/contacts/${id}`, { method: 'DELETE', headers });
    fetchData();
    fetchStats();
  };

  // --- EXISTING CRUD ACTIONS ---
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    await fetch(`http://localhost:5000/api/admin/${getEndpoint(type)}/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const openViewModal = (item) => { setViewItem(item); setShowViewModal(true); };

  const openAddModal = (type) => {
    setModalType(type);
    const defaults = {
      product: { name: '', description: '', price: '', category: '', image: '', stock: '' },
      service: { title: '', shortDesc: '', description: '', icon: 'FaTint', image: '', featuresText: '', applicationsText: '', benefits: '' },
      gallery: { title: '', category: '', image: '' },
      technology: { name: '', description: '', icon: 'FaCogs', image: '' },
      process: { stepNumber: '', title: '', description: '' }
    };
    setNewItem(defaults[type] || {});
    setShowAddModal(true);
  };

  const openEditModal = (item, type) => {
    setModalType(type);
    if (type === 'service') {
      setEditItem({
        ...item,
        featuresText: item.features ? item.features.join('\n') : '',
        applicationsText: item.applications ? item.applications.map(a => `${a.name}:${a.icon}`).join('\n') : ''
      });
    } else {
      setEditItem({ ...item });
    }
    setShowEditModal(true);
  };

  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('http://localhost:5000/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        if (formType === 'new') setNewItem(prev => ({ ...prev, image: data.imagePath }));
        else setEditItem(prev => ({ ...prev, image: data.imagePath }));
      }
    } finally {
      setUploading(false);
    }
  };

  const prepareServicePayload = (data) => {
    const payload = { ...data };
    payload.features = data.featuresText ? data.featuresText.split('\n').filter(f => f.trim() !== '') : [];
    payload.applications = data.applicationsText ? data.applicationsText.split('\n').filter(a => a.trim() !== '').map(a => {
      const [name, icon] = a.split(':');
      return { name: name?.trim(), icon: icon?.trim() || 'FaBuilding' };
    }) : [];
    delete payload.featuresText;
    delete payload.applicationsText;
    return payload;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...newItem };
    if (modalType === 'service') payload = prepareServicePayload(payload);
    await fetch(`http://localhost:5000/api/admin/${getEndpoint(modalType)}`, { method: 'POST', headers, body: JSON.stringify(payload) });
    setShowAddModal(false);
    fetchData();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...editItem };
    if (modalType === 'service') payload = prepareServicePayload(payload);
    await fetch(`http://localhost:5000/api/admin/${getEndpoint(modalType)}/${editItem.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
    setShowEditModal(false);
    fetchData();
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/company-info', {
        method: 'PUT',
        headers,
        body: JSON.stringify(infoFormData)
      });
      if (res.ok) {
        setCompanyInfo(infoFormData);
        setIsEditingInfo(false);
        toastSuccess('Company information updated successfully!');
      } else {
        toastError('Failed to update company information.');
      }
    } catch (err) {
      toastError('Failed to update company information.');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // --- HELPERS ---
  const getStatusBadge = (status) => {
    const styles = {
      processing: { bg: '#fff3cd', color: '#856404', icon: FaClock },
      confirmed: { bg: '#cce5ff', color: '#004085', icon: FaCheckCircle },
      shipped: { bg: '#d4edda', color: '#155724', icon: FaTruck },
      delivered: { bg: '#d1e7dd', color: '#0f5132', icon: FaCheckCircle },
      cancelled: { bg: '#f8d7da', color: '#721c24', icon: FaTimesCircle }
    };
    const s = styles[status] || styles.processing;
    const Icon = s.icon;
    return (
      <span className="badge px-3 py-2" style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: '600' }}>
        <Icon className="me-1" size={12} /> {status.toUpperCase()}
      </span>
    );
  };

  const ImageUploadField = ({ value, onChange, formType, label = "Upload Image" }) => (
    <div className="col-12">
      <label className="form-label small fw-semibold">{label}</label>
      <div className="input-group">
        <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, formType)} disabled={uploading} />
        <span className="input-group-text bg-white border-start-0">
          {uploading ? <FaSpinner className="spin" /> : <FaUpload />}
        </span>
      </div>
      {value && (
        <div className="mt-2 d-flex align-items-center gap-2 bg-light p-2 rounded">
          <img src={`http://localhost:5000${value}`} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
          <small className="text-muted text-truncate">{value}</small>
        </div>
      )}
    </div>
  );

  const ActionButtons = ({ item, type }) => (
    <div className="d-flex gap-2">
      <button onClick={() => openViewModal(item)} className="btn btn-sm btn-outline-primary rounded-circle" title="View"><FaEye /></button>
      <button onClick={() => openEditModal(item, type)} className="btn btn-sm btn-outline-warning rounded-circle" title="Edit"><FaEdit /></button>
      <button onClick={() => handleDelete(type, item.id)} className="btn btn-sm btn-outline-danger rounded-circle" title="Delete"><FaTrash /></button>
    </div>
  );

  const ModalWrapper = ({ title, show, onClose, onSubmit, children, submitText = "Save" }) => {
    if (!show) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4">
            <div className="modal-header border-0"><h5 className="modal-title fw-bold" style={{ color: '#0b2540' }}>{title}</h5><button type="button" className="btn-close" onClick={onClose}></button></div>
            <form onSubmit={onSubmit}><div className="modal-body">{children}</div><div className="modal-footer border-0"><button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button><button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>{submitText}</button></div></form>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'inquiries', label: 'Inquiries', icon: <FaEnvelope /> },
    { id: 'company', label: 'Company Info', icon: <FaBuilding /> },
    { id: 'services', label: 'Services', icon: <FaConciergeBell /> },
    { id: 'technologies', label: 'Technologies', icon: <FaMicroscope /> },
    { id: 'process', label: 'Process Steps', icon: <FaProjectDiagram /> },
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'gallery', label: 'Gallery', icon: <FaImages /> }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc', paddingTop: '100px' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-3"><FaSignOutAlt className="me-2" /> Logout</button>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#e0f2f1', color: '#2fa5b6' }}>
                  <FaShoppingCart size={20} />
                </div>
                <span className="badge" style={{ backgroundColor: '#f0f9fa', color: '#2fa5b6' }}>Total</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#0b2540' }}>{stats.totalOrders || 0}</h3>
              <p className="mb-0 small text-muted">Total Orders</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#fff3cd', color: '#856404' }}>
                  <FaClock size={20} />
                </div>
                <span className="badge" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>Pending</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#0b2540' }}>{stats.pendingOrders || 0}</h3>
              <p className="mb-0 small text-muted">Processing Orders</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#d4edda', color: '#155724' }}>
                  <FaMoneyBillWave size={20} />
                </div>
                <span className="badge" style={{ backgroundColor: '#d4edda', color: '#155724' }}>Revenue</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#0b2540' }}>KES {(stats.totalRevenue || 0).toLocaleString()}</h3>
              <p className="mb-0 small text-muted">Total Revenue</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="p-4 rounded-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#cce5ff', color: '#004085' }}>
                  <FaEnvelope size={20} />
                </div>
                <span className="badge" style={{ backgroundColor: '#cce5ff', color: '#004085' }}>New</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#0b2540' }}>{stats.unreadInquiries || 0}</h3>
              <p className="mb-0 small text-muted">Unread Inquiries</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-4 gap-2 flex-wrap">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button className={`nav-link rounded-pill px-4 ${activeTab === tab.id ? 'active' : ''}`}
                style={activeTab === tab.id ? { backgroundColor: '#2fa5b6' } : { color: '#0b2540', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                onClick={() => setActiveTab(tab.id)}>
                {tab.icon} <span className="ms-2">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Content Area */}
        <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              <h5 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Overview</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Recent Orders</h6>
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                          <small className="fw-semibold d-block">{order.orderNumber}</small>
                          <small className="text-muted">{order.customerName}</small>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(order.orderStatus)}
                          <small className="d-block text-muted mt-1">KES {parseFloat(order.totalAmount).toLocaleString()}</small>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-muted text-center py-3 mb-0">No orders yet</p>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Recent Inquiries</h6>
                    {contacts.slice(0, 5).map(contact => (
                      <div key={contact.id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                          <small className="fw-semibold d-block">{contact.name}</small>
                          <small className="text-muted">{contact.service}</small>
                        </div>
                        <div className="text-end">
                          {!contact.isRead && <span className="badge bg-danger">New</span>}
                          <small className="d-block text-muted mt-1">{new Date(contact.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    ))}
                    {contacts.length === 0 && <p className="text-muted text-center py-3 mb-0">No inquiries yet</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <>
              <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Manage Orders</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-semibold">{order.orderNumber}</td>
                        <td>
                          <div><small className="fw-semibold d-block">{order.customerName}</small><small className="text-muted">{order.customerEmail}</small></div>
                        </td>
                        <td><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                        <td className="fw-bold" style={{ color: '#2fa5b6' }}>KES {parseFloat(order.totalAmount).toLocaleString()}</td>
                        <td><span className="badge bg-light text-dark border text-uppercase">{order.paymentMethod}</span></td>
                        <td>{getStatusBadge(order.orderStatus)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button onClick={() => handleViewOrder(order)} className="btn btn-sm btn-outline-primary rounded-circle" title="View Details"><FaEye /></button>
                            <button onClick={() => handleOpenStatusModal(order)} className="btn btn-sm btn-outline-success rounded-circle" title="Update Status"><FaEdit /></button>
                            <button onClick={() => handleDeleteOrder(order.id)} className="btn btn-sm btn-outline-danger rounded-circle" title="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-muted text-center py-5 mb-0">No orders received yet</p>}
              </div>
            </>
          )}

          {/* INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <>
              <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Manage Inquiries</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(contact => (
                      <tr key={contact.id} style={{ backgroundColor: !contact.isRead ? '#f0f9fa' : 'transparent' }}>
                        <td>{!contact.isRead ? <span className="badge bg-danger">New</span> : <span className="badge bg-secondary">Read</span>}</td>
                        <td className="fw-semibold">{contact.name}</td>
                        <td>
                          <div><small className="d-block">{contact.email}</small><small className="text-muted">{contact.phone}</small></div>
                        </td>
                        <td><span className="badge bg-light text-dark border">{contact.service}</span></td>
                        <td><small>{new Date(contact.createdAt).toLocaleDateString()}</small></td>
                        <td>
                          <div className="d-flex gap-2">
                            <button onClick={() => handleViewContact(contact)} className="btn btn-sm btn-outline-primary rounded-circle" title="View"><FaEye /></button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="btn btn-sm btn-outline-danger rounded-circle" title="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length === 0 && <p className="text-muted text-center py-5 mb-0">No inquiries received yet</p>}
              </div>
            </>
          )}

          {/* COMPANY INFO TAB */}
          {activeTab === 'company' && (
            <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Company Information</h5>
                <button
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="btn btn-sm rounded-pill px-3"
                  style={{ backgroundColor: isEditingInfo ? '#6c757d' : '#2fa5b6', color: '#fff' }}
                >
                  {isEditingInfo ? 'Cancel' : 'Edit Information'}
                </button>
              </div>

              <form onSubmit={handleInfoSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">About Us</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="aboutUs"
                      value={infoFormData.aboutUs || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, aboutUs: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Mission</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="mission"
                      value={infoFormData.mission || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, mission: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Vision</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="vision"
                      value={infoFormData.vision || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, vision: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={infoFormData.email || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, email: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Website</label>
                    <input
                      type="text"
                      className="form-control"
                      name="website"
                      value={infoFormData.website || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, website: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Phone 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone1"
                      value={infoFormData.phone1 || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, phone1: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Phone 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone2"
                      value={infoFormData.phone2 || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, phone2: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={infoFormData.address || ''}
                      onChange={(e) => setInfoFormData({ ...infoFormData, address: e.target.value })}
                      disabled={!isEditingInfo}
                      style={{ backgroundColor: isEditingInfo ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  {isEditingInfo && (
                    <div className="col-12 text-end">
                      <button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Services</h5>
                <button onClick={() => openAddModal('service')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Service</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>ID</th><th>Title</th><th>Short Description</th><th>Icon</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                  <tbody>{services.map(s => (<tr key={s.id}><td>{s.id}</td><td className="fw-semibold">{s.title}</td><td className="text-muted small">{s.shortDesc}</td><td><span className="badge bg-light text-dark border">{s.icon}</span></td><td><ActionButtons item={s} type="service" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}

          {/* TECHNOLOGIES TAB */}
          {activeTab === 'technologies' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Technologies</h5>
                <button onClick={() => openAddModal('technology')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Technology</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>ID</th><th>Name</th><th>Icon</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                  <tbody>{technologies.map(t => (<tr key={t.id}><td>{t.id}</td><td className="fw-semibold">{t.name}</td><td><span className="badge bg-light text-dark border">{t.icon}</span></td><td><ActionButtons item={t} type="technology" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}

          {/* PROCESS STEPS TAB */}
          {activeTab === 'process' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Process Steps</h5>
                <button onClick={() => openAddModal('process')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Step</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Step #</th><th>Title</th><th>Description</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                  <tbody>{processSteps.map(p => (<tr key={p.id}><td><span className="badge rounded-pill" style={{ backgroundColor: '#2fa5b6', color: '#fff' }}>{p.stepNumber}</span></td><td className="fw-semibold">{p.title}</td><td className="text-muted small">{p.description}</td><td><ActionButtons item={p} type="process" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Products</h5>
                <button onClick={() => openAddModal('product')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Product</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                  <tbody>{products.map(p => (<tr key={p.id}><td><img src={`http://localhost:5000${p.image}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} /></td><td className="fw-semibold">{p.name}</td><td><span className="badge bg-light text-dark border">{p.category}</span></td><td>KES {parseFloat(p.price).toLocaleString()}</td><td>{p.stock}</td><td><ActionButtons item={p} type="product" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Gallery</h5>
                <button onClick={() => openAddModal('gallery')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Image</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Image</th><th>Title</th><th>Category</th><th style={{ width: '150px' }}>Actions</th></tr></thead>
                  <tbody>{gallery.map(g => (<tr key={g.id}><td><img src={`http://localhost:5000${g.image}`} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} /></td><td className="fw-semibold">{g.title}</td><td><span className="badge bg-light text-dark border">{g.category}</span></td><td><ActionButtons item={g} type="gallery" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showOrderModal && selectedOrder && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0" style={{ backgroundColor: '#f8fafc' }}>
                <div>
                  <h5 className="modal-title fw-bold mb-1" style={{ color: '#0b2540' }}>Order {selectedOrder.order.orderNumber}</h5>
                  <small className="text-muted">Placed on {new Date(selectedOrder.order.createdAt).toLocaleString()}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}><FaUser className="me-2" />Customer Information</h6>
                      <p className="mb-1"><strong>Name:</strong> {selectedOrder.order.customerName}</p>
                      <p className="mb-1"><strong>Email:</strong> {selectedOrder.order.customerEmail}</p>
                      <p className="mb-1"><strong>Phone:</strong> {selectedOrder.order.customerPhone}</p>
                      <p className="mb-0"><strong>Address:</strong> {selectedOrder.order.shippingAddress}, {selectedOrder.order.city}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}><FaShoppingCart className="me-2" />Order Summary</h6>
                      <p className="mb-1"><strong>Payment Method:</strong> <span className="text-uppercase">{selectedOrder.order.paymentMethod}</span></p>
                      <p className="mb-1"><strong>Status:</strong> {getStatusBadge(selectedOrder.order.orderStatus)}</p>
                      <p className="mb-0"><strong>Total Amount:</strong> <span className="fw-bold fs-5" style={{ color: '#2fa5b6' }}>KES {parseFloat(selectedOrder.order.totalAmount).toLocaleString()}</span></p>
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Order Items</h6>
                    <div className="table-responsive">
                      <table className="table">
                        <thead><tr><th>Product</th><th>Category</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                        <tbody>
                          {selectedOrder.items.map(item => (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img src={`http://localhost:5000${item.Product?.image || '/images/placeholder.jpg'}`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                  <span className="fw-semibold">{item.Product?.name || 'Product'}</span>
                                </div>
                              </td>
                              <td><span className="badge bg-light text-dark border">{item.Product?.category || '-'}</span></td>
                              <td>{item.quantity}</td>
                              <td>KES {parseFloat(item.price).toLocaleString()}</td>
                              <td className="fw-bold">KES {(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {selectedOrder.order.notes && (
                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
                        <h6 className="fw-bold mb-2"><FaEnvelope className="me-2" />Customer Notes</h6>
                        <p className="mb-0">{selectedOrder.order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowOrderModal(false)}>Close</button>
                <button type="button" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }} onClick={() => { setShowOrderModal(false); handleOpenStatusModal(selectedOrder.order); }}>Update Status</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      <ModalWrapper title="Update Order Status" show={showStatusModal} onClose={() => setShowStatusModal(false)} onSubmit={handleUpdateStatus} submitText="Update Status">
        {selectedOrder && (
          <>
            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className="mb-1"><strong>Order:</strong> {selectedOrder.order.orderNumber}</p>
              <p className="mb-0"><strong>Customer:</strong> {selectedOrder.order.customerName}</p>
            </div>
            <label className="form-label small fw-semibold">New Status</label>
            <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <small className="text-muted mt-2 d-block">The customer will receive an email notification about this status change.</small>
          </>
        )}
      </ModalWrapper>

      {/* CONTACT DETAILS MODAL */}
      {showContactModal && selectedContact && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold" style={{ color: '#0b2540' }}>Inquiry Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowContactModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <small className="text-muted d-block">From</small>
                  <h6 className="fw-bold mb-1">{selectedContact.name}</h6>
                  <p className="mb-0 small"><FaEnvelope className="me-1" />{selectedContact.email}</p>
                  <p className="mb-0 small"><FaPhone className="me-1" />{selectedContact.phone}</p>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Service Interested In</small>
                  <span className="badge px-3 py-2" style={{ backgroundColor: '#f0f9fa', color: '#2fa5b6', border: '1px solid #d1e8eb' }}>{selectedContact.service}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Message</small>
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className="mb-0">{selectedContact.message}</p>
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Received</small>
                  <small><FaCalendar className="me-1" />{new Date(selectedContact.createdAt).toLocaleString()}</small>
                </div>
              </div>
              <div className="modal-footer border-0">
                <a href={`mailto:${selectedContact.email}`} className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>Reply via Email</a>
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowContactModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <ModalWrapper title="Add New Product" show={showAddModal && modalType === 'product'} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={newItem.name || ''} onChange={e => setNewItem({ ...newItem, name: e.target.value })} /></div>
          <ImageUploadField value={newItem.image} formType="new" />
          <div className="col-6"><label className="form-label small fw-semibold">Price</label><input type="number" className="form-control" required value={newItem.price || ''} onChange={e => setNewItem({ ...newItem, price: e.target.value })} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Stock</label><input type="number" className="form-control" required value={newItem.stock || ''} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={newItem.category || ''} onChange={e => setNewItem({ ...newItem, category: e.target.value })} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={newItem.description || ''} onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea></div>
        </div>
      </ModalWrapper>

      {/* EDIT PRODUCT MODAL */}
      <ModalWrapper title="Edit Product" show={showEditModal && modalType === 'product'} onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit}>
        {editItem && (
          <div className="row g-3">
            <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={editItem.name || ''} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></div>
            <ImageUploadField value={editItem.image} formType="edit" />
            <div className="col-6"><label className="form-label small fw-semibold">Price</label><input type="number" className="form-control" required value={editItem.price || ''} onChange={e => setEditItem({ ...editItem, price: e.target.value })} /></div>
            <div className="col-6"><label className="form-label small fw-semibold">Stock</label><input type="number" className="form-control" required value={editItem.stock || ''} onChange={e => setEditItem({ ...editItem, stock: e.target.value })} /></div>
            <div className="col-6"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={editItem.category || ''} onChange={e => setEditItem({ ...editItem, category: e.target.value })} /></div>
            <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })}></textarea></div>
          </div>
        )}
      </ModalWrapper>

      {/* ADD/EDIT SERVICE MODAL */}
      <ModalWrapper title={showAddModal && modalType === 'service' ? "Add New Service" : "Edit Service"} show={(showAddModal || showEditModal) && modalType === 'service'} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} onSubmit={showAddModal && modalType === 'service' ? handleAddSubmit : handleEditSubmit}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.title || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, title: e.target.value }) : setEditItem({ ...editItem, title: e.target.value })} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Short Description</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.shortDesc || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, shortDesc: e.target.value }) : setEditItem({ ...editItem, shortDesc: e.target.value })} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Icon</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.icon || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, icon: e.target.value }) : setEditItem({ ...editItem, icon: e.target.value })} /></div>
          <ImageUploadField value={(showAddModal ? newItem : editItem)?.image} formType={showAddModal ? "new" : "edit"} />
          <div className="col-12"><label className="form-label small fw-semibold">Full Description</label><textarea className="form-control" rows="3" required value={(showAddModal ? newItem : editItem)?.description || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, description: e.target.value }) : setEditItem({ ...editItem, description: e.target.value })}></textarea></div>
          <div className="col-12"><label className="form-label small fw-semibold">Features (One per line)</label><textarea className="form-control" rows="3" value={(showAddModal ? newItem : editItem)?.featuresText || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, featuresText: e.target.value }) : setEditItem({ ...editItem, featuresText: e.target.value })}></textarea></div>
          <div className="col-12"><label className="form-label small fw-semibold">Applications (Name:Icon)</label><textarea className="form-control" rows="3" value={(showAddModal ? newItem : editItem)?.applicationsText || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, applicationsText: e.target.value }) : setEditItem({ ...editItem, applicationsText: e.target.value })}></textarea></div>
          <div className="col-12"><label className="form-label small fw-semibold">Benefits</label><textarea className="form-control" rows="2" value={(showAddModal ? newItem : editItem)?.benefits || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, benefits: e.target.value }) : setEditItem({ ...editItem, benefits: e.target.value })}></textarea></div>
        </div>
      </ModalWrapper>

      {/* ADD/EDIT GALLERY MODAL */}
      <ModalWrapper title={showAddModal && modalType === 'gallery' ? "Add Gallery Image" : "Edit Gallery Image"} show={(showAddModal || showEditModal) && modalType === 'gallery'} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} onSubmit={showAddModal && modalType === 'gallery' ? handleAddSubmit : handleEditSubmit}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.title || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, title: e.target.value }) : setEditItem({ ...editItem, title: e.target.value })} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.category || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, category: e.target.value }) : setEditItem({ ...editItem, category: e.target.value })} /></div>
          <ImageUploadField value={(showAddModal ? newItem : editItem)?.image} formType={showAddModal ? "new" : "edit"} />
        </div>
      </ModalWrapper>

      {/* ADD/EDIT TECHNOLOGY MODAL */}
      <ModalWrapper title={showAddModal && modalType === 'technology' ? "Add New Technology" : "Edit Technology"} show={(showAddModal || showEditModal) && modalType === 'technology'} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} onSubmit={showAddModal && modalType === 'technology' ? handleAddSubmit : handleEditSubmit}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.name || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, name: e.target.value }) : setEditItem({ ...editItem, name: e.target.value })} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Icon</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.icon || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, icon: e.target.value }) : setEditItem({ ...editItem, icon: e.target.value })} /></div>
          <ImageUploadField value={(showAddModal ? newItem : editItem)?.image} formType={showAddModal ? "new" : "edit"} />
          <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={(showAddModal ? newItem : editItem)?.description || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, description: e.target.value }) : setEditItem({ ...editItem, description: e.target.value })}></textarea></div>
        </div>
      </ModalWrapper>

      {/* ADD/EDIT PROCESS STEP MODAL */}
      <ModalWrapper title={showAddModal && modalType === 'process' ? "Add Process Step" : "Edit Process Step"} show={(showAddModal || showEditModal) && modalType === 'process'} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} onSubmit={showAddModal && modalType === 'process' ? handleAddSubmit : handleEditSubmit}>
        <div className="row g-3">
          <div className="col-4"><label className="form-label small fw-semibold">Step Number</label><input type="number" className="form-control" required value={(showAddModal ? newItem : editItem)?.stepNumber || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, stepNumber: e.target.value }) : setEditItem({ ...editItem, stepNumber: e.target.value })} /></div>
          <div className="col-8"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={(showAddModal ? newItem : editItem)?.title || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, title: e.target.value }) : setEditItem({ ...editItem, title: e.target.value })} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={(showAddModal ? newItem : editItem)?.description || ''} onChange={e => showAddModal ? setNewItem({ ...newItem, description: e.target.value }) : setEditItem({ ...editItem, description: e.target.value })}></textarea></div>
        </div>
      </ModalWrapper>

    </div>
  );
};

export default AdminDashboard;