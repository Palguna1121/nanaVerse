import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Product } from '$lib/data';

export interface CartItem extends Product {
    quantity: number;
}

const initialCart: Record<number, CartItem> = browser && localStorage.getItem('cart') 
    ? JSON.parse(localStorage.getItem('cart')!) 
    : {};

export const cart = writable<Record<number, CartItem>>(initialCart);

if (browser) {
    cart.subscribe(value => {
        localStorage.setItem('cart', JSON.stringify(value));
    });
}

export const addToCart = (product: Product) => {
    cart.update(items => {
        if (items[product.id]) {
            items[product.id].quantity += 1;
        } else {
            items[product.id] = { ...product, quantity: 1 };
        }
        return items;
    });
};

export const removeFromCart = (productId: number) => {
    cart.update(items => {
        delete items[productId];
        return items;
    });
};

export const updateQuantity = (productId: number, action: 'increase' | 'decrease') => {
    cart.update(items => {
        if (items[productId]) {
            if (action === 'increase') {
                items[productId].quantity += 1;
            } else {
                items[productId].quantity -= 1;
                if (items[productId].quantity <= 0) {
                    delete items[productId];
                }
            }
        }
        return items;
    });
};

export const clearCart = () => {
    cart.set({});
};

export const cartItems = derived(cart, ($cart) => Object.values($cart));

export const cartCount = derived(cart, ($cart) => 
    Object.values($cart).reduce((total, item) => total + item.quantity, 0)
);

export const cartTotal = derived(cart, ($cart) => 
    Object.values($cart).reduce((total, item) => total + (item.price * item.quantity), 0)
);
