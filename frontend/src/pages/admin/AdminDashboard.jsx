import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FaSignOutAlt, FaBox, FaConciergeBell, FaImages, FaTrash, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [pRes, sRes, gRes] = await Promise.all([
      fetch('http://localhost:5000/api/products'),
      fetch('http://localhost:5000/api/services'),
      fetch('http://localhost:5000/api/gallery')
    ]);
    setProducts(await pRes.json());
    setServices(await sRes.json());
    setGallery(await gRes.json());
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    await fetch(`http://localhost:5000/api/admin/${endpoint}/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs = [
    { id: 'products', label: 'Products', icon: <FaBox /> },
    { id: 'services', label: 'Services', icon: <FaConciergeBell /> },
    { id: 'gallery', label: 'Gallery', icon: <FaImages /> }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc', paddingTop: '100px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-3">
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-4 gap-2">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button 
                className={`nav-link rounded-pill px-4 ${activeTab === tab.id ? 'active' : ''}`}
                style={activeTab === tab.id ? { backgroundColor: '#2fa5b6' } : { color: '#0b2540', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} <span className="ms-2">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Content Area */}
        <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          
          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold" style={{ color: '#0b2540' }}>Manage Products</h5>
                <button className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}>
                  <FaPlus className="me-1" /> Add Product
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                        <td className="fw-semibold">{p.name}</td>
                        <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                        <td>KES {parseFloat(p.price).toLocaleString()}</td>
                        <td><button onClick={() => handleDelete('products', p.id)} className="btn btn-sm btn-outline-danger rounded-circle"><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <>
              <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Manage Services</h5>
              <div className="row g-3">
                {services.map(s => (
                  <div className="col-md-6" key={s.id}>
                    <div className="p-3 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div>
                        <h6 className="fw-bold mb-1">{s.title}</h6>
                        <small className="text-muted">{s.shortDesc}</small>
                      </div>
                      <button onClick={() => handleDelete('services', s.id)} className="btn btn-sm btn-outline-danger rounded-circle"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <>
              <h5 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Manage Gallery</h5>
              <div className="row g-3">
                {gallery.map(g => (
                  <div className="col-md-3" key={g.id}>
                    <div className="position-relative rounded-3 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                      <img src={g.image} alt={g.title} className="w-100" style={{ height: '150px', objectFit: 'cover' }} />
                      <button onClick={() => handleDelete('gallery', g.id)} className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle" style={{ width: '30px', height: '30px', padding: 0 }}><FaTrash size={12} /></button>
                      <div className="p-2"><small className="fw-semibold">{g.title}</small></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;