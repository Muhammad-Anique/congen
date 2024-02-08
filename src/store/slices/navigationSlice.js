import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: 0,
}
  
//reducer
const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNavigation: (state, action) => {
      state.data = action.payload
      console.log(state.data);
    },
  },
})


// Action creators are generated for each case reducer function
export default  navigationSlice.reducer
export const { setNavigation } = navigationSlice.actions; 