import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: 0,
}
  
//reducer
const oldDashboardSlice = createSlice({
  name: 'oldDashboard',
  initialState,
  reducers: {
    setOldDashboardSlice: (state, action) => {
      state.data = action.payload
      console.log(state.data);
    },
  },
})

// Action creators are generated for each case reducer function
export default  oldDashboardSlice.reducer
export const { setOldDashboardSlice } = oldDashboardSlice.actions; 