import React from "react";
import { FaHeart, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from '../ui/IconButton';
import Image from '../common/Image';

export default function ProductCard({ product, quantity, maxQuantity, onAdd, onSetQuantity, wishlisted, onToggleWishlist }) {
  const inCart = quantity > 0;
  const outOfStock = product.stock === 0;

  return (
    <div className="bw-catalog-card">
      <div className="bw-catalog-card__figure">
        <Image src={product.image} alt={product.name} />
        {inCart ? (
          <span className="bw-catalog-card__badge">
            <Badge>{quantity} in cart</Badge>
          </span>
        ) : null}
        <button type="button" className="bw-wishlist-btn" aria-pressed={wishlisted} aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => onToggleWishlist(product)} >
          <FaHeart aria-hidden="true" />
        </button>
      </div>
      <div className="bt-catalog-card__body">
        <p className="bw-catalog-card__title" title={product.name}>{product.name}</p>
        <div className="bw-catalog-card__action">
          {outOfStock ? (
            <Button variant="outline" size="sm" block disabled>Out of Stock</Button>
          ) : inCart ? (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <IconButton
                label={`Remove one ${product.name}`}
                icon={<FaMinus size={10} />}
                onClick={() => onSetQuantity(product.id, quantity - 1)}
              />
              <span className="bt-quantity__value" aria-live="polite">{quantity}</span>
              <IconButton
                label={`Add one more ${product.name}`}
                icon ={<FaPlus size={10}/>}
                variant ="solid"
                disabled={quantity >= maxQuantity}
                onClick={()=> onSetQuantity(product.id,quantity+1)}
              />
            </div>
          ):(
            <Button size="sm" block icon={<FaShoppingCart size={12} aria-hidden="true"/>} onClick={()=> onAdd(product)} >Add to Cart</Button>
          )}
        </div>
      </div>
    </div>
  )

}