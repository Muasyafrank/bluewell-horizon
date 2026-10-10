import React, { useState } from 'react';
import { FaArrowLeft, FaLock, FaShoppingBag, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SEO } from '../components/common';
import { PageBanner } from '../components/layout';
import { Button, Card, EmptyState, Modal } from '../components/ui';
import CartLine from '../components/shop/CartLine';
import { toastSuccess } from '../utils/toast';
import { pluralise } from '../utils/format';

export default function Cart() {
  const { items, count, isEmpty, maxQuantity, setQuantity, removeItem, clearCart } = useCart();
  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleRemove = (item) => {
    removeItem(item.id);
    toastSuccess(`${item.name} removed from your cart`);
  };

  const handleClear = () => {
    clearCart();
    setConfirmingClear(false);
    toastSuccess('Cart cleared');
  };

  return (
    <>
      <SEO
        title="Your cart"
        description="Review the water treatment products in your cart and continue to checkout."
        path="/cart"
        noIndex
      />

      <PageBanner
        eyebrow="Cart"
        title="Your cart"
        lead={
          isEmpty
            ? 'Nothing here yet.'
            : `${count} ${pluralise(count, 'item')} ready for checkout.`
        }
        image="/images/gallery-5.png"
      />

      <section className="bw-section">
        <div className="container">
          {isEmpty ? (
            <EmptyState
              icon={<FaShoppingBag />}
              title="Your cart is empty"
              description="Browse the shop to find the filtration, softening or disinfection system that suits your supply."
              action={
                <Button to="/shop" size="lg" icon={<FaShoppingBag aria-hidden="true" />}>
                  Start shopping
                </Button>
              }
            />
          ) : (
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 mb-0">
                    {count} {pluralise(count, 'item')}
                  </h2>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FaTrash size={11} aria-hidden="true" />}
                    onClick={() => setConfirmingClear(true)}
                  >
                    Clear cart
                  </Button>
                </div>

                <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                  {items.map((item) => (
                    <CartLine
                      key={item.id}
                      item={item}
                      maxQuantity={maxQuantity}
                      onSetQuantity={setQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </ul>

                <Link to="/shop" className="d-inline-flex align-items-center gap-2 text-decoration-none">
                  <FaArrowLeft aria-hidden="true" /> Continue shopping
                </Link>
              </div>

              <div className="col-lg-4">
                <Card tint className="bw-sticky-aside">
                  <h2 className="h5 mb-3">Ready to checkout?</h2>
                  <p className="text-muted mb-0">
                    You have {count} {pluralise(count, 'item')} in your cart. Delivery options and
                    your order total are confirmed on the next step.
                  </p>
                </Card>

                <Button to="/checkout" size="lg" block className="mt-4" icon={<FaLock aria-hidden="true" />}>
                  Continue to checkout
                </Button>

                <p className="text-center small text-muted mt-3 mb-0">
                  Pay by M-Pesa, bank transfer or cash on delivery.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={confirmingClear}
        onClose={() => setConfirmingClear(false)}
        title="Clear your cart?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmingClear(false)}>
              Keep items
            </Button>
            <Button variant="danger" onClick={handleClear}>
              Clear cart
            </Button>
          </>
        }
      >
        <p className="mb-0">
          This removes all {count} {pluralise(count, 'item')} from your cart. You can add them again
          from the shop.
        </p>
      </Modal>
    </>
  );
}