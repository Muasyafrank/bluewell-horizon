import React, { useState } from 'react';
import { FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import { FiCheckCircle, FiShoppingCart } from 'react-icons/fi';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Modal from '../ui/Modal';
import Image from '../common/Image';
import { shortCategoryName } from '../../data/categories';

/**
 * Product card for the shop grid.
 *
 * Everything shown is real catalogue data: the tag is the product's own
 * category, and the stock line comes from `product.stock`. The card used to
 * stamp "Water Treatment" and the same three claims (High Efficiency, Durable,
 * Easy Maintenance) on every product, including accessories and membranes, so
 * those are gone. Pass `product.highlights` (up to 3 short strings) to list
 * product-specific features.
 */
const LOW_STOCK_AT = 5;

function stockStatus(stock) {
  if (stock === 0) return { tone: 'out', label: 'Out of stock' };
  if (typeof stock === 'number' && stock <= LOW_STOCK_AT) return { tone: 'low', label: `Only ${stock} left` };
  return { tone: 'in', label: 'In stock' };
}

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
  const highlights = (product.highlights || []).slice(0, 3);
  const status = stockStatus(product.stock);

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

        {product.category ? <span className="bw-product-card__tag" title={product.category}>{shortCategoryName(product.category)}</span> : null}

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

        {highlights.length ? (
          <ul className="bw-product-card__features">
            {highlights.map((label) => (
              <li key={label}>
                <FiCheckCircle aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className={`bw-product-card__stock bw-product-card__stock--${status.tone}`}>{status.label}</p>

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
        {product.category ? <p className="small text-muted mb-1">Category: {product.category}</p> : null}
        <p className={`bw-product-card__stock bw-product-card__stock--${status.tone}`}>{status.label}</p>
        {highlights.length ? (
          <ul className="bw-product-card__features bw-product-card__features--modal">
            {highlights.map((label) => (
              <li key={label}>
                <FiCheckCircle aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4">{cartControl}</div>
      </Modal>
    </div>
  );
}