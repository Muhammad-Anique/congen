import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: 0,
}
  
//reducer
const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.data = action.payload
      console.log(state.data);
    },
  },
})

// Action creators are generated for each case reducer function
export default  sessionSlice.reducer
export const { setSession } = sessionSlice.actions; 