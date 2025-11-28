// src/store/index.ts (ou store.ts)
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage par défaut
import { combineReducers } from 'redux';

import cartReducer from './cartSlice';
import authReducer from './authSlice';
import categoryReducer from './categorySlice';

// Configuration de redux-persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart'],
};

// Combine les reducers
const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
});

// Reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Pour persistor (nécessaire dans index.tsx)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;