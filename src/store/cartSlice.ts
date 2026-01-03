import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    cartItemId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
    maxStock: number;
}

interface CartState {
    items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
};

const saveCartToStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
    items: loadCartFromStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                item =>
                    item.productId === action.payload.productId &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color
            );

            if (existingItem) {
                existingItem.quantity = Math.min(
                    existingItem.quantity + action.payload.quantity,
                    existingItem.maxStock
                );
            } else {
                state.items.push(action.payload);
            }

            saveCartToStorage(state.items);
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ cartItemId: string; quantity: number }>
        ) => {
            const item = state.items.find(i => i.cartItemId === action.payload.cartItemId);
            if (!item) return;

            if (action.payload.quantity > item.maxStock) {
                item.quantity = item.maxStock;
            } else if (action.payload.quantity < 1) {
                item.quantity = 1;
            } else {
                item.quantity = action.payload.quantity;
            }

            saveCartToStorage(state.items);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.cartItemId !== action.payload);
            saveCartToStorage(state.items);
        },

        clearCart: state => {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
