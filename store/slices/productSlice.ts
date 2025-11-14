import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { cachedFetch } from "@/lib/cachedFetch";
import { CACHE_TTL } from "@/lib/cache";

// Types
interface Product {
  _id?: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  categories_tags?: string[];
  image_url?: string;
  image_front_url?: string;
  image_ingredients_url?: string;
  image_nutrition_url?: string;
  nutrition_grades_tags?: string[];
  nutriscore_grade?: string;
  unique_scans_n?: number;
  ingredients_text?: string;
  nutriments?: {
    energy?: number;
    "energy-kcal"?: number;
    fat?: number;
    "saturated-fat"?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    proteins?: number;
    salt?: number;
    sodium?: number;
    [key: string]: any;
  };
  allergens?: string;
  allergens_tags?: string[];
  traces?: string;
  traces_tags?: string[];
  labels?: string;
  labels_tags?: string[];
  countries?: string;
  countries_tags?: string[];
  stores?: string;
  code?: string;
  url?: string;
  [key: string]: any;
}

interface ProductState {
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  recentlyViewed: Product[];
  favorites: string[];
}

// Initial state
const initialState: ProductState = {
  currentProduct: null,
  loading: false,
  error: null,
  recentlyViewed: [],
  favorites: [],
};

// Async thunks
export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductDetails",
  async (barcode: string, { rejectWithValue }) => {
    try {
      const data = await cachedFetch(`/api/product?barcode=${barcode}`, {
        cacheTTL: CACHE_TTL.LONG,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch product details"
      );
    }
  }
); // Slice
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.error = null;
    },
    addToRecentlyViewed: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(
        (p) => p._id !== product._id && p.code !== product.code
      );
      // Add to beginning
      state.recentlyViewed.unshift(product);
      // Keep only last 10
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const barcode = action.payload;
      if (!state.favorites.includes(barcode)) {
        state.favorites.push(barcode);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const barcode = action.payload;
      state.favorites = state.favorites.filter((code) => code !== barcode);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const barcode = action.payload;
      if (state.favorites.includes(barcode)) {
        state.favorites = state.favorites.filter((code) => code !== barcode);
      } else {
        state.favorites.push(barcode);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload.product || null;
      // Automatically add to recently viewed
      if (action.payload.product) {
        const product = action.payload.product;
        state.recentlyViewed = state.recentlyViewed.filter(
          (p) => p._id !== product._id && p.code !== product.code
        );
        state.recentlyViewed.unshift(product);
        if (state.recentlyViewed.length > 10) {
          state.recentlyViewed = state.recentlyViewed.slice(0, 10);
        }
      }
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.currentProduct = null;
    });
  },
});

export const {
  clearCurrentProduct,
  addToRecentlyViewed,
  clearRecentlyViewed,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  clearError,
} = productSlice.actions;

// Selectors
export const selectCurrentProduct = (state: RootState) =>
  state.product.currentProduct;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
export const selectRecentlyViewed = (state: RootState) =>
  state.product.recentlyViewed;
export const selectFavorites = (state: RootState) => state.product.favorites;
export const selectIsFavorite = (barcode: string) => (state: RootState) =>
  state.product.favorites.includes(barcode);

export default productSlice.reducer;
