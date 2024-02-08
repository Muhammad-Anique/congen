import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: 0,
}
  
//reducer
const youngDashboardSlice = createSlice({
  name: 'youngDashboard',
  initialState,
  reducers: {
    setYoungDashboardSlice: (state, action) => {
      state.data = action.payload
      console.log(state.data);
    },
  },
})

// Action creators are generated for each case reducer function
export default  youngDashboardSlice.reducer
export const { setYoungDashboardSlice } = youngDashboardSlice.actions; 