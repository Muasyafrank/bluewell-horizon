import React, { useState } from 'react';
import { FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { FiCheckCircle, FiShield, FiShoppingCart, FiTool, FiZap } from 'react-icons/fi';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Modal from '../ui/Modal';
import Image from '../common/Image';

/**
 * Premium product card.
 *
 * This is the same component as before (Shop.jsx and its props are
 * unchanged) — only the markup and styling are new. Cart and wishlist
 * behaviour, including the in-cart quantity stepper and the out-of-stock
 * state, work exactly as they did; "View Details" is the one new piece of
 * behaviour, opening a lightweight modal since the app has no per-product
 * page to link to yet.
 *
 * Trust badges (High Efficiency / Durable / Easy Maintenance) aren't part of
 * the product data — there's no per-product field for them yet — so they're
 * shown the same on every card for now. Pass `product.highlights` (an array
 * of up to 3 short strings) later to make them product-specific without
 * touching this component again.
 */
const DEFAULT_HIGHLIGHTS = [
  { icon: FiZap, label: 'High Efficiency' },
  { icon: FiShield, label: 'Durable' },
  { icon: FiTool, label: 'Easy Maintenance' },
];

export default function ProductCard({
  product,
  quantity,
  maxQuantity,
  onAdd,
  onSetQuantity,
  wishlisted,
  onToggleWishlist,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const inCart = quantity > 0;
  const outOfStock = product.stock === 0;
  const highlights = product.highlights?.length
    ? product.highlights.map((label, index) => ({ icon: DEFAULT_HIGHLIGHTS[index]?.icon || FiCheckCircle, label }))
    : DEFAULT_HIGHLIGHTS;

  const cartControl = outOfStock ? (
    <Button variant="outline" size="sm" block disabled>
      Out of stock
    </Button>
  ) : inCart ? (
    <div className="bw-product-card__stepper">
      <IconButton
        label={`Remove one ${product.name}`}
        icon={<FaMinus size={10} />}
        onClick={() => onSetQuantity(product.id, quantity - 1)}
      />
      <span className="bw-quantity__value" aria-live="polite">
        {quantity}
      </span>
      <IconButton
        label={`Add one more ${product.name}`}
        icon={<FaPlus size={10} />}
        variant="solid"
        disabled={quantity >= maxQuantity}
        onClick={() => onSetQuantity(product.id, quantity + 1)}
      />
    </div>
  ) : (
    <button type="button" className="bw-product-card__btn bw-product-card__btn--primary" onClick={() => onAdd(product)}>
      <FiShoppingCart size={15} aria-hidden="true" />
      Add to Cart
    </button>
  );

  return (
    <div className="bw-product-card">
      <div className="bw-product-card__media">
        {/* Flowing-water accent, purely decorative. */}
        <svg
          className="bw-product-card__wave"
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M0,30 C60,55 100,5 160,25 C210,42 250,15 300,30 L300,60 L0,60 Z" />
        </svg>

        <span className="bw-product-card__tag">Water Treatment</span>

        <button
          type="button"
          className="bw-product-card__fav"
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => onToggleWishlist(product)}
        >
          <FaHeart aria-hidden="true" />
        </button>

        <div className="bw-product-card__image-wrap">
          <Image src={product.image} alt={product.name} className="bw-product-card__image" />
        </div>
      </div>

      <div className="bw-product-card__body">
        <h3 className="bw-product-card__title" title={product.name}>
          {product.name}
        </h3>
        <p className="bw-product-card__desc">{product.description}</p>

        <ul className="bw-product-card__features">
          {highlights.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="bw-product-card__actions">
          <button type="button" className="bw-product-card__btn bw-product-card__btn--outline" onClick={() => setDetailsOpen(true)}>
            View Details
          </button>
          {cartControl}
        </div>
      </div>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title={product.name}>
        <Image src={product.image} alt={product.name} className="bw-product-card__modal-image" />
        <p className="bw-prose mt-3 mb-4">{product.description}</p>
        <ul className="bw-product-card__features bw-product-card__features--modal">
          {highlights.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">{cartControl}</div>
      </Modal>
    </div>
  );
}