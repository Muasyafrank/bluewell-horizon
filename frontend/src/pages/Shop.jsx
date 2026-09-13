import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaFilter, FaPlus, FaCheck } from 'react-icons/fa';
import SEO from '../components/SEO';
import WaterLoader from '../components/WaterLoader';
import { addToCart as addProductToCart, getCart, getCartCount, getCartTotal } from '../utils/cart';
import { toastSuccess } from '../utils/toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // ✅ ALL HOOKS FIRST - before any conditional returns
  useEffect(() => {
    fetchProducts();
    setCart(getCart());
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
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

  const handleAddToCart = (product) => {
    const result = addProductToCart(product);
    setCart(getCart());
    
    if (result.updated) {
      toastSuccess(`Added another ${product.name} to cart (${result.quantity} in cart)`);
    } else {
      toastSuccess(`${product.name} added to cart`);
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // ✅ EARLY RETURN AFTER ALL HOOKS
  if (loading) {
    return <WaterLoader text="Loading products..." />;
  }

  return (
    <>
      <SEO 
        title="Shop - Water Treatment Products & Equipment"
        description="Browse our range of water treatment products including RO systems, UV sterilizers, water softeners, and complete bottling plant packages. Quality equipment at competitive prices in Kenya."
        keywords="buy water purifier Kenya, RO system price, UV sterilizer Kenya, water softener Nairobi, water treatment equipment"
        url="https://www.bluewellhorizonlimited.com/shop"
      />

      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
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
                  style={{ borderRadius: '0 12px 12px 0', padding: '12px 16px' }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaFilter style={{ color: '#2fa5b6' }} />
                </span>
                <select
                  className="form-select border-start-0"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ borderRadius: '0 12px 12px 0', padding: '12px 16px' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            </p>
            {cart.length > 0 && (
              <Link to="/cart" className="btn text-white rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', border: 'none' }}>
                <FaShoppingCart className="me-2" /> View Cart ({getCartCount()})
              </Link>
            )}
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <FaSearch size={48} className="mb-3" style={{ color: '#cbd5e0' }} />
                <h5 className="fw-bold" style={{ color: '#0b2540' }}>No products found</h5>
                <p className="text-muted">Try adjusting your search or filter criteria.</p>
                <button 
                  className="btn text-white rounded-pill px-4" 
                  style={{ backgroundColor: '#2fa5b6' }}
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const inCart = isInCart(product.id);
                return (
                  <div className="col-md-6 col-lg-4" key={product.id}>
                    <div 
                      className="rounded-4 h-100 d-flex flex-column" 
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
                      <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400'; }}
                        />
                        {inCart && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#2fa5b6', color: '#fff' }}>
                              <FaCheck className="me-1" /> In Cart
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <span className="badge rounded-pill mb-2 align-self-start" style={{ 
                          backgroundColor: '#f0f9fa', 
                          color: '#2fa5b6',
                          border: '1px solid #d1e8eb'
                        }}>
                          {product.category}
                        </span>
                        <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{product.name}</h5>
                        <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                          {product.description.length > 120 
                            ? `${product.description.substring(0, 120)}...` 
                            : product.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3" style={{ borderTop: '1px solid #f0f4f8' }}>
                          <h4 className="fw-bold mb-0" style={{ color: '#2fa5b6', fontSize: '1.3rem' }}>
                            KES {parseFloat(product.price).toLocaleString()}
                          </h4>
                          <button
                            className="btn rounded-pill px-3 d-flex align-items-center gap-2"
                            onClick={() => handleAddToCart(product)}
                            style={{ 
                              backgroundColor: inCart ? '#0b2540' : '#2fa5b6', 
                              color: '#fff', 
                              border: 'none',
                              transition: 'all 0.2s'
                            }}
                          >
                            <FaPlus size={12} />
                            {inCart ? 'Add More' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Summary Bar */}
          {cart.length > 0 && (
            <div className="mt-5 p-4 rounded-4 sticky-bottom" style={{ 
              backgroundColor: '#0b2540', 
              border: '1px solid #0b2540',
              position: 'sticky',
              bottom: '20px',
              boxShadow: '0 -4px 20px rgba(11, 37, 64, 0.15)'
            }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: '#ffffff' }}>
                    <FaShoppingCart className="me-2" style={{ color: '#2fa5b6' }} />
                    Shopping Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
                  </h5>
                  <p className="mb-0" style={{ color: '#cbd5e0' }}>
                    Total: <strong style={{ color: '#2fa5b6', fontSize: '1.2rem' }}>KES {getCartTotal().toLocaleString()}</strong>
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/cart" className="btn btn-outline-light rounded-pill px-4">
                    View Cart
                  </Link>
                  <Link to="/checkout" className="btn rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', color: '#fff', border: 'none' }}>
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;