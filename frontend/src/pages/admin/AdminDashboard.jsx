import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  FaSignOutAlt, FaBox, FaConciergeBell, FaImages, FaTrash, FaPlus, 
  FaMicroscope, FaProjectDiagram, FaEye, FaEdit, FaUpload, FaSpinner
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  
  // Modal & Upload States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  const getEndpoint = (type) => type === 'process' ? 'process-steps' : `${type}s`;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [pRes, sRes, gRes, tRes, psRes] = await Promise.all([
      fetch('http://localhost:5000/api/products'),
      fetch('http://localhost:5000/api/services'),
      fetch('http://localhost:5000/api/gallery'),
      fetch('http://localhost:5000/api/technologies'),
      fetch('http://localhost:5000/api/process-steps')
    ]);
    setProducts(await pRes.json());
    setServices(await sRes.json());
    setGallery(await gRes.json());
    setTechnologies(await tRes.json());
    setProcessSteps(await psRes.json());
  };

  // --- ACTIONS ---
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

  // --- IMAGE UPLOAD ---
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
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      alert('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  // --- SUBMIT HANDLERS ---
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

  const handleLogout = () => { logout(); navigate('/'); };

  // --- UI HELPERS ---
  const ImageUploadField = ({ value, onChange, formType, label = "Upload Image" }) => (
    <div className="col-12">
      <label className="form-label small fw-semibold">{label}</label>
      <div className="input-group">
        <input 
          type="file" 
          className="form-control" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, formType)} 
          disabled={uploading} 
        />
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

  const ModalWrapper = ({ title, show, onClose, onSubmit, children }) => {
    if (!show) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4">
            <div className="modal-header border-0"><h5 className="modal-title fw-bold" style={{ color: '#0b2540' }}>{title}</h5><button type="button" className="btn-close" onClick={onClose}></button></div>
            <form onSubmit={onSubmit}><div className="modal-body">{children}</div><div className="modal-footer border-0"><button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button><button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6' }}>Save Changes</button></div></form>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
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

        <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
          {/* [TABLES REMAIN EXACTLY THE SAME AS BEFORE - OMITTED FOR BREVITY] */}
          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0b2540' }}>Manage Services</h5>
                <button onClick={() => openAddModal('service')} className="btn btn-sm rounded-pill text-white px-3" style={{ backgroundColor: '#2fa5b6' }}><FaPlus className="me-1" /> Add Service</button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>ID</th><th>Title</th><th>Short Description</th><th>Icon</th><th style={{width: '150px'}}>Actions</th></tr></thead>
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
                  <thead><tr><th>ID</th><th>Name</th><th>Icon</th><th style={{width: '150px'}}>Actions</th></tr></thead>
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
                  <thead><tr><th>Step #</th><th>Title</th><th>Description</th><th style={{width: '150px'}}>Actions</th></tr></thead>
                  <tbody>{processSteps.map(p => (<tr key={p.id}><td><span className="badge rounded-pill" style={{backgroundColor: '#2fa5b6', color: '#fff'}}>{p.stepNumber}</span></td><td className="fw-semibold">{p.title}</td><td className="text-muted small">{p.description}</td><td><ActionButtons item={p} type="process" /></td></tr>))}</tbody>
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
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th style={{width: '150px'}}>Actions</th></tr></thead>
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
                  <thead><tr><th>Image</th><th>Title</th><th>Category</th><th style={{width: '150px'}}>Actions</th></tr></thead>
                  <tbody>{gallery.map(g => (<tr key={g.id}><td><img src={`http://localhost:5000${g.image}`} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} /></td><td className="fw-semibold">{g.title}</td><td><span className="badge bg-light text-dark border">{g.category}</span></td><td><ActionButtons item={g} type="gallery" /></td></tr>))}</tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- VIEW MODAL --- */}
      {showViewModal && viewItem && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0"><h5 className="modal-title fw-bold" style={{ color: '#0b2540' }}>View Details</h5><button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button></div>
              <div className="modal-body">
                {modalType === 'service' ? (
                  <>
                    <h4 className="fw-bold">{viewItem.title}</h4>
                    <p className="text-muted">{viewItem.shortDesc}</p>
                    <hr />
                    <p>{viewItem.description}</p>
                    {viewItem.features && <div className="mb-3"><h6 className="fw-bold">Features:</h6><ul className="mb-0">{viewItem.features.map((f,i)=><li key={i}>{f}</li>)}</ul></div>}
                    {viewItem.applications && <div className="mb-3"><h6 className="fw-bold">Applications:</h6><div className="d-flex flex-wrap gap-2">{viewItem.applications.map((a,i)=><span key={i} className="badge bg-light text-dark border">{a.name} ({a.icon})</span>)}</div></div>}
                    {viewItem.benefits && <div className="p-3 rounded-3 bg-light"><h6 className="fw-bold">Benefits:</h6><p className="mb-0">{viewItem.benefits}</p></div>}
                  </>
                ) : (
                  Object.entries(viewItem).map(([key, value]) => (
                    <div key={key} className="mb-2"><strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> <span className="text-muted ms-2">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span></div>
                  ))
                )}
              </div>
              <div className="modal-footer border-0"><button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowViewModal(false)}>Close</button></div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      <ModalWrapper title={`Add New ${modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''}`} show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit}>
        <div className="row g-3">
          {modalType === 'product' && (
            <>
              <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} /></div>
              <ImageUploadField value={newItem.image} formType="new" />
              <div className="col-6"><label className="form-label small fw-semibold">Price</label><input type="number" className="form-control" required value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: e.target.value})} /></div>
              <div className="col-6"><label className="form-label small fw-semibold">Stock</label><input type="number" className="form-control" required value={newItem.stock || ''} onChange={e => setNewItem({...newItem, stock: e.target.value})} /></div>
              <div className="col-6"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={newItem.category || ''} onChange={e => setNewItem({...newItem, category: e.target.value})} /></div>
              <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea></div>
            </>
          )}
          {modalType === 'service' && (
            <>
              <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} /></div>
              <div className="col-12"><label className="form-label small fw-semibold">Short Description</label><input type="text" className="form-control" required value={newItem.shortDesc || ''} onChange={e => setNewItem({...newItem, shortDesc: e.target.value})} /></div>
              <div className="col-6"><label className="form-label small fw-semibold">Icon (e.g., FaTint)</label><input type="text" className="form-control" required value={newItem.icon || ''} onChange={e => setNewItem({...newItem, icon: e.target.value})} /></div>
              <ImageUploadField value={newItem.image} formType="new" />
              <div className="col-12"><label className="form-label small fw-semibold">Full Description</label><textarea className="form-control" rows="3" required value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea></div>
              <div className="col-12"><label className="form-label small fw-semibold">Features (One per line)</label><textarea className="form-control" rows="3" value={newItem.featuresText || ''} onChange={e => setNewItem({...newItem, featuresText: e.target.value})}></textarea></div>
              <div className="col-12"><label className="form-label small fw-semibold">Applications (Name:Icon, one per line)</label><textarea className="form-control" rows="3" value={newItem.applicationsText || ''} onChange={e => setNewItem({...newItem, applicationsText: e.target.value})}></textarea></div>
              <div className="col-12"><label className="form-label small fw-semibold">Benefits</label><textarea className="form-control" rows="2" value={newItem.benefits || ''} onChange={e => setNewItem({...newItem, benefits: e.target.value})}></textarea></div>
            </>
          )}
          {modalType === 'gallery' && (
            <>
              <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} /></div>
              <div className="col-12"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={newItem.category || ''} onChange={e => setNewItem({...newItem, category: e.target.value})} /></div>
              <ImageUploadField value={newItem.image} formType="new" />
            </>
          )}
          {modalType === 'technology' && (
            <>
              <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} /></div>
              <div className="col-6"><label className="form-label small fw-semibold">Icon (e.g., FaCogs)</label><input type="text" className="form-control" required value={newItem.icon || ''} onChange={e => setNewItem({...newItem, icon: e.target.value})} /></div>
              <ImageUploadField value={newItem.image} formType="new" />
              <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea></div>
            </>
          )}
          {modalType === 'process' && (
            <>
              <div className="col-4"><label className="form-label small fw-semibold">Step Number</label><input type="number" className="form-control" required value={newItem.stepNumber || ''} onChange={e => setNewItem({...newItem, stepNumber: e.target.value})} /></div>
              <div className="col-8"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={newItem.title || ''} onChange={e => setNewItem({...newItem, title: e.target.value})} /></div>
              <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea></div>
            </>
          )}
        </div>
      </ModalWrapper>

      {/* --- EDIT MODAL --- */}
      <ModalWrapper title={`Edit ${modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''}`} show={showEditModal} onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit}>
        {editItem && (
          <div className="row g-3">
            {modalType === 'product' && (
              <>
                <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} /></div>
                <ImageUploadField value={editItem.image} formType="edit" />
                <div className="col-6"><label className="form-label small fw-semibold">Price</label><input type="number" className="form-control" required value={editItem.price || ''} onChange={e => setEditItem({...editItem, price: e.target.value})} /></div>
                <div className="col-6"><label className="form-label small fw-semibold">Stock</label><input type="number" className="form-control" required value={editItem.stock || ''} onChange={e => setEditItem({...editItem, stock: e.target.value})} /></div>
                <div className="col-6"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={editItem.category || ''} onChange={e => setEditItem({...editItem, category: e.target.value})} /></div>
                <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea></div>
              </>
            )}
            {modalType === 'service' && (
              <>
                <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                <div className="col-12"><label className="form-label small fw-semibold">Short Description</label><input type="text" className="form-control" required value={editItem.shortDesc || ''} onChange={e => setEditItem({...editItem, shortDesc: e.target.value})} /></div>
                <div className="col-6"><label className="form-label small fw-semibold">Icon</label><input type="text" className="form-control" required value={editItem.icon || ''} onChange={e => setEditItem({...editItem, icon: e.target.value})} /></div>
                <ImageUploadField value={editItem.image} formType="edit" />
                <div className="col-12"><label className="form-label small fw-semibold">Full Description</label><textarea className="form-control" rows="3" required value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea></div>
                <div className="col-12"><label className="form-label small fw-semibold">Features (One per line)</label><textarea className="form-control" rows="3" value={editItem.featuresText || ''} onChange={e => setEditItem({...editItem, featuresText: e.target.value})}></textarea></div>
                <div className="col-12"><label className="form-label small fw-semibold">Applications (Name:Icon)</label><textarea className="form-control" rows="3" value={editItem.applicationsText || ''} onChange={e => setEditItem({...editItem, applicationsText: e.target.value})}></textarea></div>
                <div className="col-12"><label className="form-label small fw-semibold">Benefits</label><textarea className="form-control" rows="2" value={editItem.benefits || ''} onChange={e => setEditItem({...editItem, benefits: e.target.value})}></textarea></div>
              </>
            )}
            {modalType === 'gallery' && (
              <>
                <div className="col-12"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                <div className="col-12"><label className="form-label small fw-semibold">Category</label><input type="text" className="form-control" required value={editItem.category || ''} onChange={e => setEditItem({...editItem, category: e.target.value})} /></div>
                <ImageUploadField value={editItem.image} formType="edit" />
              </>
            )}
            {modalType === 'technology' && (
              <>
                <div className="col-12"><label className="form-label small fw-semibold">Name</label><input type="text" className="form-control" required value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} /></div>
                <div className="col-6"><label className="form-label small fw-semibold">Icon</label><input type="text" className="form-control" required value={editItem.icon || ''} onChange={e => setEditItem({...editItem, icon: e.target.value})} /></div>
                <ImageUploadField value={editItem.image} formType="edit" />
                <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea></div>
              </>
            )}
            {modalType === 'process' && (
              <>
                <div className="col-4"><label className="form-label small fw-semibold">Step Number</label><input type="number" className="form-control" required value={editItem.stepNumber || ''} onChange={e => setEditItem({...editItem, stepNumber: e.target.value})} /></div>
                <div className="col-8"><label className="form-label small fw-semibold">Title</label><input type="text" className="form-control" required value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                <div className="col-12"><label className="form-label small fw-semibold">Description</label><textarea className="form-control" rows="3" required value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea></div>
              </>
            )}
          </div>
        )}
      </ModalWrapper>
    </div>
  );
};

export default AdminDashboard;