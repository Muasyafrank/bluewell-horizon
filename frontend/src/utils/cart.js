export const CART_UPDATE_EVENT = 'cartUpdate';

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
};

export const addToCart = (product) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        const updatedCart = cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        saveCart(updatedCart);
        return { updated: true, quantity: existingItem.quantity + 1 };
    } else {
        const updatedCart = [...cart, { ...product, quantity: 1 }];
        saveCart(updatedCart);
        return { updated: false, quantity: 1 };
    }
};

export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    return updatedCart;
}

export const updateQuantity = (productId, newQuantity) => {
    const cart = getCart();
    if (newQuantity < 1) return cart;

    const updatedCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
    return updatedCart;
};

export const clearCart = () => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
};

export const getTotalItems = () => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}
// Get total items count
export const getCartCount = () => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};
export const getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}