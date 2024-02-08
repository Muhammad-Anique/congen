import { combineReducers } from 'redux';
import navigationSlice from './slices/navigationSlice'
import sessionSlice from './slices/sessionSlice';
import oldDashboardSlice from './slices/oldDashboardSlice';
import youngDashboardSlice from './slices/youngDashboardSlice';

import userSlice from './slices/userSlice'

const rootReducer = combineReducers({
   
    navigation : navigationSlice,
    session : sessionSlice,
    oldDashboard: oldDashboardSlice,
    youngDashboard: youngDashboardSlice, 
    user: userSlice,

});

export default rootReducer;