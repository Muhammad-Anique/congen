import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: {},
}
  
//reducer
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload
      console.log(state.data);
    },
  },
})


// Action creators are generated for each case reducer function
export default  userSlice.reducer
export const { setUser } = userSlice.actions; 