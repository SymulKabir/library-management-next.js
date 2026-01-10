import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Student {
  student_id: string
  name: string
  email: string
  created_at: number
}

interface StudentState {
  data: Student | null
  progressing: boolean
}

const initialState: StudentState = {
  data: null,
  progressing: false,
}

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student>) => {
      console.log("action.payload ===================>", action.payload)
      state.data = {...action.payload}
    },
    removeStudent: (state) => {
      state.data = null
    },
    updateStudentProgress: (state, action: PayloadAction<boolean>) => {
      state.progressing = action.payload
    },
  },
})

export const { setStudent, updateStudentProgress } = studentSlice.actions

export default studentSlice.reducer
