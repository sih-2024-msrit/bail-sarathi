import {combineReducers} from "@reduxjs/toolkit"
/* Reducers here in the format 
    import reducer_name from "pathofreducer"
    Add more slices like that and add their reducers here
    */
import authReducer from "../slices/authSlice"
import userReducer from "../slices/userSlice";
import summaryReducer from "../slices/summarySlice";
import themeReducer from "../slices/themeSlice";

const rootReducer=combineReducers({
    auth:authReducer,
    user:userReducer,
    summary:summaryReducer,
    theme:themeReducer,
})

export default rootReducer;
