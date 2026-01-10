import { configureStore } from '@reduxjs/toolkit'
import booksReducer from "./books/reducer"
import studentReducer from "./student/reducer"

export default configureStore({
  reducer: {
    student: studentReducer,
    books: booksReducer
  },
})