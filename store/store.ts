import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./slices/homeSlice";
import searchSlice from "./slices/searchSlice";
import productSlice from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    home: homeSlice,
    search: searchSlice,
    product: productSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
