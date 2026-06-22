import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FaSignOutAlt, FaBox, FaConciergeBell, FaImages, FaTrash, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  // Modal & Form States
  const [showAddModal, setShowAddModal] = useState(null); // 'product', 'service', 'gallery', or null
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image: '', stock: '' });
  const [newService, setNewService] = useState({ title: '', shortDesc: '', description: '', icon: 'FaTint', image: '' });
  const [newGallery, setNewGallery] = useState({ title: '', category: '', image: '' });

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

  // --- ADD HANDLERS ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/products', { method: 'POST', headers, body: JSON.stringify(newProduct) });
    setShowAddModal(null);
    setNewProduct({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    fetchData();
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/services', { method: 'POST', headers, body: JSON.stringify(newService) });
    setShowAddModal(null);
    setNewService({ title: '', shortDesc: '', description: '', icon: 'FaTint', image: '' });
    fetchData();
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/gallery', { method: 'POST', headers, body: JSON.stringify(newGallery) });
    setShowAddModal(null);
    setNewGallery({ title: '', category: '', image: '' });
    fetchData();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Reusable Modal Wrapper
  const ModalWrapper = ({ title, show, onClose, onSubmit, children }) => {
    if (!show) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" style={{ color: '#0b2540' }}>{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">{children}</div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc', paddingTop: '100px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-3"><FaSignOutAlt className="me-2" /> Logout</button>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-4 gap-2">
          {[{id:'products', label:'Products', icon:<FaBox/>}, {id:'services', label:'Services', icon:<FaConciergeBell/>}, {id:'gallery', label:'Gallery', icon:<FaImages/>}].map(tab => (
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
          
          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Products</h5>
                <button onClick={() => setShowAddModal('product')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}>
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
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Services</h5>
                <button onClick={() => setShowAddModal('service')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}>
                  <FaPlus className="me-1" /> Add Service
                </button>
              </div>
              <div className="row g-3">
                {services.map(s => (
                  <div className="col-md-6" key={s.id}>
                    <div className="p-3 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div><h6 className="fw-bold mb-1">{s.title}</h6><small className="text-muted">{s.shortDesc}</small></div>
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
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Gallery</h5>
                <button onClick={() => setShowAddModal('gallery')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}>
                  <FaPlus className="me-1" /> Add Image
                </button>
              </div>
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

      {/* --- MODALS --- */}
      
      {/* Add Product Modal */}
      <ModalWrapper title="Add New Product" show={showAddModal === 'product'} onClose={() => setShowAddModal(null)} onSubmit={handleAddProduct}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Product Name</label><input type="text" className="form-control" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Price (KES)</label><input type="number" className="form-control" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Stock</label><input type="number" className="form-control" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Image Path</label><input type="text" className="form-control" placeholder="/images/product.jpg" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea></div>
        </div>
      </ModalWrapper>

      {/* Add Service Modal */}
      <ModalWrapper title="Add New Service" show={showAddModal === 'service'} onClose={() => setShowAddModal(null)} onSubmit={handleAddService}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Service Title</label><input type="text" className="form-control" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Short Description</label><input type="text" className="form-control" required value={newService.shortDesc} onChange={e => setNewService({...newService, shortDesc: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Icon Name (e.g., FaTint)</label><input type="text" className="form-control" required value={newService.icon} onChange={e => setNewService({...newService, icon: e.target.value})} /></div>
          <div className="col-6"><label className="form-label small fw-semibold">Image Path</label><input type="text" className="form-control" placeholder="/images/service.jpg" required value={newService.image} onChange={e => setNewService({...newService, image: e.target.value})} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Full Description</label><textarea className="form-control" rows="4" required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}></textarea></div>
        </div>
      </ModalWrapper>

      {/* Add Gallery Modal */}
      <ModalWrapper title="Add Gallery Image" show={showAddModal === 'gallery'} onClose={() => setShowAddModal(null)} onSubmit={handleAddGallery}>
        <div className="row g-3">
          <div className="col-12"><label className="form-label small fw-semibold">Image Title</label><input type="text" className="form-control" required value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={newGallery.category} onChange={e => setNewGallery({...newGallery, category: e.target.value})} /></div>
          <div className="col-12"><label className="form-label small fw-semibold">Image Path</label><input type="text" className="form-control" placeholder="/images/gallery-1.jpg" required value={newGallery.image} onChange={e => setNewGallery({...newGallery, image: e.target.value})} /></div>
        </div>
      </ModalWrapper>

    </div>
  );
};

export default AdminDashboard;