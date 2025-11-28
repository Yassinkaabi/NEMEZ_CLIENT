import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';

export interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    slug: string;
}

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    selectedCategory: Category | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
    selectedCategory: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories');
            return response.data.data || response.data.categories || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data.data || response.data.category || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Category By Id
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
                state.loading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
