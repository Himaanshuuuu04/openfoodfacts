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

interface Category {
  id?: string;
  name?: string;
  url?: string;
  products?: number;
  [key: string]: any;
}

interface SearchState {
  // Search by name
  searchResults: Product[];
  searchTerm: string;
  searchLoading: boolean;
  searchError: string | null;

  // Search by barcode
  barcodeResult: Product | null;
  barcodeLoading: boolean;
  barcodeError: string | null;

  // Category search
  categoryProducts: Product[];
  categoryName: string;
  categorySortBy: "name" | "nutrition_grade" | "unique_scans_n";
  categoryOrder: "asc" | "desc";
  categoryLoading: boolean;
  categoryError: string | null;

  // All categories
  allCategories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

// Initial state
const initialState: SearchState = {
  searchResults: [],
  searchTerm: "",
  searchLoading: false,
  searchError: null,

  barcodeResult: null,
  barcodeLoading: false,
  barcodeError: null,

  categoryProducts: [],
  categoryName: "",
  categorySortBy: "unique_scans_n",
  categoryOrder: "asc",
  categoryLoading: false,
  categoryError: null,

  allCategories: [],
  categoriesLoading: false,
  categoriesError: null,
};

// Async thunks
export const searchProductsByName = createAsyncThunk(
  "search/searchProductsByName",
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const data = await cachedFetch(
        `/api/search/name?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
          cacheTTL: CACHE_TTL.MEDIUM,
        }
      );
      return { data, searchTerm };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search products");
    }
  }
);
export const searchProductByBarcode = createAsyncThunk(
  "search/searchProductByBarcode",
  async (barcode: string, { rejectWithValue }) => {
    try {
      const data = await cachedFetch(`/api/search/barcode?barcode=${barcode}`, {
        cacheTTL: CACHE_TTL.LONG,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to find product");
    }
  }
);
export const searchProductsByCategory = createAsyncThunk(
  "search/searchProductsByCategory",
  async (
    params: { category: string; sortBy?: string; order?: string },
    { rejectWithValue }
  ) => {
    try {
      const { category, sortBy = "unique_scans_n", order = "asc" } = params;

      // Check cache first
      const cacheKey = createCacheKey(
        "search_category",
        category,
        sortBy,
        order
      );
      const cachedData = apiCache.get(cacheKey);

      if (cachedData) {
        return { data: cachedData, category };
      }

      const response = await fetch(
        `/api/search/category?category=${encodeURIComponent(
          category
        )}&sortBy=${sortBy}&order=${order}`
      );
      if (!response.ok) {
        throw new Error("Failed to search category");
      }
      const data = await response.json();

      // Cache for 10 minutes
      apiCache.set(cacheKey, data, CACHE_TTL.LONG);

      return { data, category };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search category");
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "search/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await cachedFetch("/api/search/category-all", {
        cacheTTL: CACHE_TTL.VERY_LONG,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
); // Slice
export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTerm = "";
      state.searchError = null;
    },
    clearBarcodeResult: (state) => {
      state.barcodeResult = null;
      state.barcodeError = null;
    },
    clearCategoryResults: (state) => {
      state.categoryProducts = [];
      state.categoryName = "";
      state.categoryError = null;
    },
    setCategorySorting: (
      state,
      action: PayloadAction<{
        sortBy: "name" | "nutrition_grade" | "unique_scans_n";
        order: "asc" | "desc";
      }>
    ) => {
      state.categorySortBy = action.payload.sortBy;
      state.categoryOrder = action.payload.order;
    },
    clearAllErrors: (state) => {
      state.searchError = null;
      state.barcodeError = null;
      state.categoryError = null;
      state.categoriesError = null;
    },
  },
  extraReducers: (builder) => {
    // Search products by name
    builder.addCase(searchProductsByName.pending, (state) => {
      state.searchLoading = true;
      state.searchError = null;
    });
    builder.addCase(searchProductsByName.fulfilled, (state, action) => {
      state.searchLoading = false;
      state.searchResults = action.payload.data.products || [];
      state.searchTerm = action.payload.searchTerm;
    });
    builder.addCase(searchProductsByName.rejected, (state, action) => {
      state.searchLoading = false;
      state.searchError = action.payload as string;
    });

    // Search product by barcode
    builder.addCase(searchProductByBarcode.pending, (state) => {
      state.barcodeLoading = true;
      state.barcodeError = null;
    });
    builder.addCase(searchProductByBarcode.fulfilled, (state, action) => {
      state.barcodeLoading = false;
      state.barcodeResult = action.payload.product || null;
    });
    builder.addCase(searchProductByBarcode.rejected, (state, action) => {
      state.barcodeLoading = false;
      state.barcodeError = action.payload as string;
    });

    // Search products by category
    builder.addCase(searchProductsByCategory.pending, (state) => {
      state.categoryLoading = true;
      state.categoryError = null;
    });
    builder.addCase(searchProductsByCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      state.categoryProducts = action.payload.data.products || [];
      state.categoryName = action.payload.category;
    });
    builder.addCase(searchProductsByCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.categoryError = action.payload as string;
    });

    // Fetch all categories
    builder.addCase(fetchAllCategories.pending, (state) => {
      state.categoriesLoading = true;
      state.categoriesError = null;
    });
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.categoriesLoading = false;
      state.allCategories = action.payload.tags || [];
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload as string;
    });
  },
});

export const {
  setSearchTerm,
  clearSearchResults,
  clearBarcodeResult,
  clearCategoryResults,
  setCategorySorting,
  clearAllErrors,
} = searchSlice.actions;

// Selectors
export const selectSearchResults = (state: RootState) =>
  state.search.searchResults;
export const selectSearchTerm = (state: RootState) => state.search.searchTerm;
export const selectSearchLoading = (state: RootState) =>
  state.search.searchLoading;
export const selectSearchError = (state: RootState) => state.search.searchError;

export const selectBarcodeResult = (state: RootState) =>
  state.search.barcodeResult;
export const selectBarcodeLoading = (state: RootState) =>
  state.search.barcodeLoading;
export const selectBarcodeError = (state: RootState) =>
  state.search.barcodeError;

export const selectCategoryProducts = (state: RootState) =>
  state.search.categoryProducts;
export const selectCategoryName = (state: RootState) =>
  state.search.categoryName;
export const selectCategorySortBy = (state: RootState) =>
  state.search.categorySortBy;
export const selectCategoryOrder = (state: RootState) =>
  state.search.categoryOrder;
export const selectCategoryLoading = (state: RootState) =>
  state.search.categoryLoading;
export const selectCategoryError = (state: RootState) =>
  state.search.categoryError;

export const selectAllCategories = (state: RootState) =>
  state.search.allCategories;
export const selectCategoriesLoading = (state: RootState) =>
  state.search.categoriesLoading;
export const selectCategoriesError = (state: RootState) =>
  state.search.categoriesError;

export default searchSlice.reducer;
