import React from "react";
import { FaHeart,FaShoppingCart,FaTrash } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { SEO,Image } from "../components/common";
import { Button,EmptyState } from "../components/ui";
import { toastSuccess } from "../utils/toast";

export default function Wishlist() {
    const {items, isEmpty,removeItem, clearWishlist} = useWishlist();
    const {addItem} = useCart();

    const handleAddToCart = (item) => {
        addItem(item);
        toastSuccess(`${item.name} added to your cart`);
    };
    const handleRemove = (item) =>{
        removeItem(item)
        toastSuccess(`${item.name} removed from your wishlist`);
    };

    return(
        <>

        <SEO title="My wishlist" path ="/wishlist" noIndex />
        <section className="bw-page bw-section">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <h1 className="h3 mb-0">My WishList</h1>
                {!isEmpty ? (
                    <Button variant="outline" size="sm" onClick={clearWishlist} >Clear wishlist</Button>
                ) : null
                }
            </div>
            {isEmpty ? (
                <EmptyState
                icon={<FaHeart />}
                title="Your wishlist is empty"
                description="Tap the heart on any product in the shop to save it here for later."
                action={<Button to="/shop">Browse the Shop</Button>}
                />
            ):(
                <div className="row g-3">
                    {items.map((item)=>(
                        <div className="col-6 col-lg-3" key={item.id}>
                            <div className="bw-catalog-card">
                                <div className="bw-catalog-card__figure">
                                    <Image src={item.image} alt={item.name}/>
                                </div>
                                <div className="bw-catalog-card__body">
                                    <p className="bw-catalog-card__title" title="item.name">
                                        {item.name}
                                    </p>
                                    <div className="bw-catalog-card__action d-flex flex-column gap-2">
                                        <Button size="sm" block icon={<FaShoppingCart size={12} aria-hidden="true" />} onClick={() => handleAddToCart(item)} > Add to Cart</Button>
                                        <Button variant ="outline" size = "sm" block icon={<FaTrash size={11} aria-hidden ="true" />} onClick={() => handleRemove(item)} >Remove</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>       
        </>
    )
}