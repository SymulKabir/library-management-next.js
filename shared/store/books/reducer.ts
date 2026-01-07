import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Book {
  book_id: string
  title: string
  author: string
  category: string
  availability: boolean
  image_url: string
  stock: number
  created_at: number
  updated_at: number
}

interface BooksState {
  value: Book[]
  progressing: boolean
}

const initialState: BooksState = {
  value: [],
  progressing: false,
}

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.value = [...action.payload]
    },
    addBooks: (state, action: PayloadAction<Book[]>) => {
      state.value = [...state.value, ...action.payload]
    },
    updateBookProgress: (state, action: PayloadAction<boolean>) => {
      state.progressing = action.payload
    },
  },
})

export const { setBooks, addBooks, updateBookProgress } = booksSlice.actions

export default booksSlice.reducer
