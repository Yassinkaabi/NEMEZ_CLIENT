import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
    items: loadCartFromStorage()
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
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            saveCartToStorage(state.items);
        },

        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find(i => i.productId === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
                saveCartToStorage(state.items);
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.productId !== action.payload);
            saveCartToStorage(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        }
    }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;