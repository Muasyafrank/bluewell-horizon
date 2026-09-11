import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { toastSuccess, toastWarning } from '../utils/toast';
const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  

  const updateQuantity =  (id,newQuantity) =>{
    if (newQuantity < 1) {
      toastWarning('Quantity must be at least 1');
      return;
    }
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item,quantity: newQuantity} : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart',JSON.stringify(updatedCart));
    toastSuccess('Cart Updated');
  };

  const removeItem = (id) =>{
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart',JSON.stringify(updatedCart));
    toastSuccess('Item removed from cart');
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Page Header */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#0b2540' }}>
            Shopping <span className="fst-italic" style={{ color: '#2fa5b6' }}>Cart</span>
          </h1>
          <p className="lead mb-0" style={{ color: '#4a5568' }}>
            Review your items and proceed to checkout.
          </p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-5">
          {cart.length === 0 ? (
            <div className="text-center py-5">
              <FaShoppingCart className="fs-1 text-muted mb-3" />
              <h3 className="fw-bold mb-3" style={{ color: '#0b2540' }}>Your cart is empty</h3>
              <p className="text-muted mb-4">Looks like you haven't added any items yet.</p>
              <Link to="/shop" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#2fa5b6', border: 'none' }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex gap-4 p-4 mb-3 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-2" style={{ color: '#0b2540' }}>{item.name}</h5>
                        <p className="text-muted small mb-2">{item.category}</p>
                        <h6 className="fw-bold mb-3" style={{ color: '#2fa5b6' }}>
                          KES {parseFloat(item.price).toLocaleString()}
                        </h6>
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ width: '32px', height: '32px', padding: '0' }}
                            >
                              -
                            </button>
                            <span className="fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ width: '32px', height: '32px', padding: '0' }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn btn-sm text-danger ms-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/shop" className="btn btn-outline-primary rounded-pill px-4">
                  ← Continue Shopping
                </Link>
              </div>

              <div className="col-lg-4">
                <div className="p-4 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', position: 'sticky', top: '100px' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#0b2540' }}>Order Summary</h4>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-bold">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Delivery</span>
                    <span className="fw-bold">Calculated at checkout</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold" style={{ color: '#0b2540' }}>Total</span>
                    <span className="fw-bold fs-4" style={{ color: '#2fa5b6' }}>KES {total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="btn btn-primary w-100 rounded-pill py-3 mb-3"
                    style={{ backgroundColor: '#2fa5b6', border: 'none' }}
                  >
                    Proceed to Checkout <FaArrowRight className="ms-2" />
                  </button>
                  <p className="small text-muted text-center mb-0">
                    Secure checkout powered by Bluewell Horizon
                  </p>
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