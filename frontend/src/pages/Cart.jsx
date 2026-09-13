import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import SEO from '../components/SEO';
import WaterLoader from '../components/WaterLoader';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartTotal } from '../utils/cart';
import { toastSuccess, toastWarning } from '../utils/toast';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // ✅ ALL HOOKS FIRST
  useEffect(() => {
    const savedCart = getCart();
    if (savedCart.length === 0) {
      setLoading(false);
      // Don't redirect immediately - show empty state instead
    } else {
      setCart(savedCart);
    }
    setLoading(false);
  }, []);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      toastWarning('Quantity must be at least 1');
      return;
    }
    if (newQuantity > 99) {
      toastWarning('Maximum quantity is 99');
      return;
    }
    const updatedCart = updateQuantity(id, newQuantity);
    setCart(updatedCart);
    toastSuccess('Cart updated');
  };

  const handleRemoveItem = (id, productName) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
    toastSuccess(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      setCart([]);
      toastSuccess('Cart cleared');
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = 0; // Calculated at checkout
  const total = subtotal + deliveryFee;

  // ✅ EARLY RETURN AFTER HOOKS
  if (loading) {
    return <WaterLoader text="Loading your cart..." />;
  }

  return (
    <>
      <SEO 
        title="Shopping Cart - Bluewell Horizon"
        description="Review your water treatment products in the shopping cart. Proceed to checkout to complete your order."
        url="https://www.bluewellhorizonlimited.com/cart"
      />

      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#2fa5b6' }}></div>
            <span className="text-uppercase small fw-semibold" style={{ color: '#0b2540', letterSpacing: '3px' }}>
              Shopping Cart
            </span>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#0b2540', lineHeight: 1.2 }}>
            Your <span className="fst-italic" style={{ color: '#2fa5b6' }}>Cart</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568' }}>
            {cart.length > 0 
              ? `You have ${getCartCount()} ${getCartCount() === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is empty'}
          </p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="text-center py-5">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" 
                   style={{ width: '100px', height: '100px', backgroundColor: '#f0f9fa' }}>
                <FaShoppingBag size={48} style={{ color: '#2fa5b6' }} />
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Your cart is empty</h3>
              <p className="text-muted mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
                Looks like you haven't added any products to your cart yet. Browse our shop to find the perfect water treatment solution for your needs.
              </p>
              <Link to="/shop" className="btn btn-lg rounded-pill px-5" style={{ backgroundColor: '#2fa5b6', color: '#fff', border: 'none' }}>
                <FaShoppingBag className="me-2" /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-5">
              {/* Cart Items */}
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0" style={{ color: '#0b2540' }}>
                    Cart Items ({getCartCount()})
                  </h4>
                  <button 
                    onClick={handleClearCart}
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    <FaTrash className="me-2" size={12} /> Clear Cart
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-4 d-flex gap-3 align-items-center"
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2fa5b6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      {/* Product Image */}
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=200'; }}
                      />

                      {/* Product Info */}
                      <div className="flex-grow-1">
                        <span className="badge rounded-pill mb-2" style={{ 
                          backgroundColor: '#f0f9fa', 
                          color: '#2fa5b6',
                          border: '1px solid #d1e8eb',
                          fontSize: '0.7rem'
                        }}>
                          {item.category}
                        </span>
                        <h6 className="fw-bold mb-1" style={{ color: '#0b2540' }}>{item.name}</h6>
                        <p className="text-muted small mb-0">
                          KES {parseFloat(item.price).toLocaleString()} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex flex-column align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2" style={{ backgroundColor: '#f8fafc', borderRadius: '30px', padding: '4px' }}>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="fw-bold px-2" style={{ color: '#0b2540', minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px', backgroundColor: '#2fa5b6', color: '#fff', border: 'none' }}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="btn btn-sm text-danger"
                          style={{ fontSize: '0.8rem', background: 'none', border: 'none' }}
                        >
                          <FaTrash className="me-1" size={12} /> Remove
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-end" style={{ minWidth: '120px' }}>
                        <small className="text-muted d-block">Subtotal</small>
                        <h5 className="fw-bold mb-0" style={{ color: '#2fa5b6' }}>
                          KES {(item.price * item.quantity).toLocaleString()}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <Link 
                  to="/shop" 
                  className="d-inline-flex align-items-center gap-2 mt-4 text-decoration-none"
                  style={{ color: '#2fa5b6' }}
                >
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="p-4 rounded-4" style={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  position: 'sticky',
                  top: '100px'
                }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Order Summary</h4>
                  
                  <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <span className="text-muted">Delivery Fee</span>
                    <span className="fw-semibold" style={{ color: '#2fa5b6' }}>Calculated at checkout</span>
                  </div>

                  <div className="d-flex justify-content-between mb-4 pt-2">
                    <span className="fw-bold fs-5" style={{ color: '#0b2540' }}>Total</span>
                    <span className="fw-bold fs-4" style={{ color: '#2fa5b6' }}>KES {total.toLocaleString()}</span>
                  </div>

                  <div className="mb-3 p-3 rounded-3" style={{ backgroundColor: '#fff', border: '1px solid #d1e8eb' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FaCheckCircle style={{ color: '#2fa5b6' }} />
                      <small className="fw-semibold" style={{ color: '#0b2540' }}>Secure Checkout</small>
                    </div>
                    <p className="small text-muted mb-0">
                      Your payment information is protected with industry-standard encryption.
                    </p>
                  </div>

                  <Link 
                    to="/checkout" 
                    className="btn btn-lg w-100 rounded-pill py-3 fw-semibold"
                    style={{ backgroundColor: '#2fa5b6', color: '#fff', border: 'none' }}
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      We accept M-Pesa, Card, and Cash on Delivery
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;