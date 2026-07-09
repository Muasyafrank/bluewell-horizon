import SEO from '../components/SEO';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaFilter, FaSearch } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
     <SEO 
        title="Shop - Water Treatment Products & Equipment"
        description="Browse our range of water treatment products including RO systems, UV sterilizers, water softeners, and complete bottling plant packages. Quality equipment at competitive prices."
        keywords="buy water purifier Kenya, RO system price, UV sterilizer Kenya, water softener Nairobi, water treatment equipment"
        url="https://www.bluewellhorizonlimited.com/shop"
      />
      {/* Page Header */}
      <section className="py-5" style={{ }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#cbd5e0' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
              Shop
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2 }}>
            Water Treatment <span className="fst-italic" style={{ color: '#2fa5b6' }}>Products</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568', maxWidth: '700px' }}>
            Purchase high-quality water treatment equipment, filters, and spare parts directly from us.
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          {/* Search and Filter */}
          <div className="row mb-5">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch style={{ color: '#2fa5b6' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '12px 0 0 12px' }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ borderRadius: '12px' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No products found.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div className="col-md-6 col-lg-4" key={product.id}>
                  <div 
                    className="rounded-4 h-100" 
                    style={{ 
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.borderColor = '#2fa5b6'; 
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 165, 182, 0.12)'; 
                      e.currentTarget.style.transform = 'translateY(-4px)'; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.borderColor = '#e2e8f0'; 
                      e.currentTarget.style.boxShadow = 'none'; 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                    }}
                  >
                    <div style={{ height: '250px', overflow: 'hidden' }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-4">
                      <span className="badge rounded-pill mb-2" style={{ 
                        backgroundColor: '#f0f9fa', 
                        color: '#2fa5b6',
                        border: '1px solid #d1e8eb'
                      }}>
                        {product.category}
                      </span>
                      <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{product.name}</h5>
                      <p className="text-muted small mb-3" style={{ fontSize: '0.9rem' }}>
                        {product.description.substring(0, 100)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="fw-bold mb-0" style={{ color: '#2fa5b6' }}>
                          KES {parseFloat(product.price).toLocaleString()}
                        </h4>
                        <button
                          className="btn rounded-pill px-3"
                          onClick={() => addToCart(product)}
                          style={{ backgroundColor: '#2fa5b6', color: '#fff', border: 'none' }}
                        >
                          <FaShoppingCart className="me-2" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="mt-5 p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: '#0b2540' }}>
                    Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </h5>
                  <p className="mb-0 text-muted">
                    Total: KES {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </p>
                </div>
                <Link to="/checkout" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', border: 'none' }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;