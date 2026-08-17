import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  category_id: string;
  category_name: string;
  category_image: string;
  description?: string;
  created_at: string;
  updated_at: string;
  total_books?: number; 
}

interface CategoryState {
  value: Category[];
  progressing: boolean;
}

const initialState: CategoryState = {
  value: [],
  progressing: true,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.value = [...action.payload];
    },
    addCategory: (state, action: PayloadAction<Category[]>) => {
      state.value = [...state.value, ...action.payload];
    },
    updateCategoryProgress: (state, action: PayloadAction<boolean>) => {
      state.progressing = action.payload;
    },
  },
});

export const { setCategories, addCategory, updateCategoryProgress } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
