import React, { createContext, useCallback,useContext,useEffect,useMemo,useReducer} from 'react';

const STORAGE_KEY = 'bluewell.wishlist';

const WishlistContext = createContext(null);

function toWishlistItem(product) {
    return{
        id:product.id,
        name:product.name,
        image:product.image,
        category:product.category,
    };
    
}

function readStoredWishlist() {
    if(typeof window === 'undefined') return [];

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item)=> item && item.id !=null);
    } catch {
        return [];
    }
}

function wishlistReducer(state,action) {
    switch (action.type) {
        case 'toggle':{
            const exists = state.some((item) => item.id === action.product.id);
            if (exists) return state.filter((item) => item.id !== action.product.id);
            return [...state,toWishlistItem(action.product)]; 
        }
        case 'remove':
            return state.filter((item) => item.id !== action.id);
        
        case 'clear':
            return [];
        
        case 'replace':
            return action.items;
        default:
            return state;
    }
}

export function WishlistProvider({children}) {
    const [items, dispatch] = useReducer(wishlistReducer, undefined, readStoredWishlist);

    useEffect(()=>{
        try {
            window.localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
        } catch {
            
        }
    },[items]);
    useEffect(()=>{
        const handleStorage = (event) => {
            if(event.key && event.key !== STORAGE_KEY) return;
            dispatch({type:'replace',items:readStoredWishlist()});
        };
        window.addEventListener('storage',handleStorage);
        return () => window.removeEventListener('storage',handleStorage);

    },[]);

    const toggleItem = useCallback((product)=> dispatch({type:'toggle',product}),[]);
    const removeItem = useCallback((id) => dispatch({type:'remove', id}),[]);
    const clearWishlist = useCallback(() => dispatch({type:'clear'}),[]);

    const value = useMemo(() =>{
        const ids = new Set(items.map((item)=>item.id));
        return{
            items,
            count:items.length,
            isEmpty:items.length === 0,
            isWishlisted: (id) => ids.has(id),
            toggleItem,
            removeItem,
            clearWishlist,
        };
    },[items,toggleItem,removeItem,clearWishlist]);

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>

}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used inside a WishlistProvider');
    return context;
}