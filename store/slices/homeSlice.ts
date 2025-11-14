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
  image_url?: string;
  nutrition_grades_tags?: string[];
  unique_scans_n?: number;
  [key: string]: any;
}

interface HomeState {
  products: Product[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  productLoading: boolean;
  productError: string | null;
}

// Initial state
const initialState: HomeState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  selectedProduct: null,
  productLoading: false,
  productError: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "home/fetchProducts",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const data = await cachedFetch(`/api/home?page=${page}`, {
        cacheTTL: CACHE_TTL.MEDIUM,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);
export const fetchProductByBarcode = createAsyncThunk(
  "home/fetchProductByBarcode",
  async (barcode: string, { rejectWithValue }) => {
    try {
      const data = await cachedFetch(`/api/product?barcode=${barcode}`, {
        cacheTTL: CACHE_TTL.LONG,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
); // Slice
export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.productError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products || [];
      state.totalPages = action.payload.page_count || 1;
      state.currentPage = action.payload.page || 1;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by barcode
    builder.addCase(fetchProductByBarcode.pending, (state) => {
      state.productLoading = true;
      state.productError = null;
    });
    builder.addCase(fetchProductByBarcode.fulfilled, (state, action) => {
      state.productLoading = false;
      state.selectedProduct = action.payload.product || null;
    });
    builder.addCase(fetchProductByBarcode.rejected, (state, action) => {
      state.productLoading = false;
      state.productError = action.payload as string;
    });
  },
});

export const { setCurrentPage, clearSelectedProduct, clearError } =
  homeSlice.actions;

// Selectors
export const selectProducts = (state: RootState) => state.home.products;
export const selectCurrentPage = (state: RootState) => state.home.currentPage;
export const selectTotalPages = (state: RootState) => state.home.totalPages;
export const selectLoading = (state: RootState) => state.home.loading;
export const selectError = (state: RootState) => state.home.error;
export const selectSelectedProduct = (state: RootState) =>
  state.home.selectedProduct;
export const selectProductLoading = (state: RootState) =>
  state.home.productLoading;
export const selectProductError = (state: RootState) => state.home.productError;

export default homeSlice.reducer;
