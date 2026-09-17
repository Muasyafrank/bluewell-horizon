import React, { useState, useEffect } from 'react';
import { products, productCategories } from '../data/products';
import { FaShoppingCart, FaFilter, FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toastSuccess } from '../utils/toast';

const Shop = () => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  const getCartQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toastSuccess(`${product.name} added to cart!`);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc', paddingTop: '100px' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Our Products</h1>
          <p className="text-muted">High-quality water treatment systems for every need</p>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {productCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row g-4">
          {filteredProducts.map(product => {
            const cartQty = getCartQuantity(product.id);
            
            return (
              <div key={product.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div className="position-relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    {cartQty > 0 && (
                      <span
                        className="badge position-absolute top-0 end-0 m-2 rounded-pill"
                        style={{ backgroundColor: '#2fa5b6' }}
                      >
                        {cartQty} in cart
                      </span>
                    )}
                    <span
                      className="badge position-absolute top-0 start-0 m-2 rounded-pill"
                      style={{ backgroundColor: '#0b2540' }}
                    >
                      {product.category}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2" style={{ color: '#0b2540' }}>
                      {product.name}
                    </h5>
                    <p className="card-text text-muted small flex-grow-1">
                      {product.description}
                    </p>
                    <div className="mt-3">
                      <h4 className="fw-bold mb-3" style={{ color: '#2fa5b6' }}>
                        KES {product.price.toLocaleString()}
                      </h4>
                      
                      {cartQty === 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn w-100 text-white rounded-pill"
                          style={{ backgroundColor: '#2fa5b6' }}
                        >
                          <FaShoppingCart className="me-2" />
                          Add to Cart
                        </button>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            onClick={() => updateQuantity(product.id, cartQty - 1)}
                            className="btn btn-outline-secondary rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <FaMinus />
                          </button>
                          <span className="fw-bold fs-5">{cartQty}</span>
                          <button
                            onClick={() => updateQuantity(product.id, cartQty + 1)}
                            className="btn btn-outline-secondary rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;