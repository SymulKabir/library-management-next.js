import { configureStore } from '@reduxjs/toolkit'
import booksReducer from "./books/reducer"
import studentReducer from "./student/reducer"
import adminReducer from "./admin/reducer"

export default configureStore({
  reducer: {
    student: studentReducer,
    admin: adminReducer,
    books: booksReducer
  },
})