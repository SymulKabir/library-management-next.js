import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Admin {
  admin_id: string
  name: string
  email: string
  created_at: number
}

interface StudentState {
  data: Admin | null
  progressing: boolean
}

const initialState: StudentState = {
  data: null,
  progressing: false,
}

export const studentSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      console.log("action.payload ===================>", action.payload)
      state.data = {...action.payload}
    },
    removeAdmin: (state) => {
      state.data = null
    },
    updateAdminProgress: (state, action: PayloadAction<boolean>) => {
      state.progressing = action.payload
    },
  },
})

export const { setAdmin, removeAdmin, updateAdminProgress } = studentSlice.actions

export default studentSlice.reducer
