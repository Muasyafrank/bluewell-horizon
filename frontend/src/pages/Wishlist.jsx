import React from 'react';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Image, Reveal, SEO } from '../components/common';
import { Button, EmptyState } from '../components/ui';
import PageHero from '../components/marketing/PageHero';
import { toastSuccess } from '../utils/toast';
import { pluralise } from '../utils/format';

export default function Wishlist() {
  const { items, isEmpty, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem(item);
    toastSuccess(`${item.name} added to your cart`);
  };

  const handleRemove = (item) => {
    removeItem(item);
    toastSuccess(`${item.name} removed from your wishlist`);
  };

  return (
    <>
      <SEO title="My wishlist" path="/wishlist" noIndex />

      <PageHero
        size="sm"
        eyebrow="Wishlist"
        title="Saved for later"
        lead={
          isEmpty
            ? 'Products you save in the shop appear here.'
            : `${items.length} ${pluralise(items.length, 'product')} you have saved.`
        }
        image="/images/gallery-5.png"
      />

      <section className="bw-section">
        <div className="container">
          {isEmpty ? (
            <EmptyState
              icon={<FaHeart />}
              title="Your wishlist is empty"
              description="Tap the heart on any product in the shop to save it here for later."
              action={<Button to="/shop">Browse the shop</Button>}
            />
          ) : (
            <>
              <div className="d-flex justify-content-end mb-4">
                <Button variant="outline" size="sm" onClick={clearWishlist}>
                  Clear wishlist
                </Button>
              </div>

              <div className="row g-4">
                {items.map((item, index) => (
                  <Reveal className="col-6 col-lg-3" index={index % 4} key={item.id}>
                    <article className="bw-wish-card">
                      <div className="bw-wish-card__figure">
                        <Image src={item.image} alt={item.name} />
                      </div>
                      <div className="bw-wish-card__body">
                        <h2 className="bw-wish-card__title" title={item.name}>
                          {item.name}
                        </h2>
                        <div className="d-flex flex-column gap-2">
                          <Button
                            size="sm"
                            block
                            icon={<FaShoppingCart size={12} aria-hidden="true" />}
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            block
                            icon={<FaTrash size={11} aria-hidden="true" />}
                            onClick={() => handleRemove(item)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
