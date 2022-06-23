import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
  current: string
}

const initialState: InitialState = {
  current: ''
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.current = action.payload
    }
  }
})

export const { setCurrentUser } = slice.actions
export default slice.reducer
