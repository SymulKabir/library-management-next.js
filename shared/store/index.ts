import { configureStore } from '@reduxjs/toolkit'
import booksReducer from "./books/reducer"

export default configureStore({
  reducer: {
    books: booksReducer
  },
})