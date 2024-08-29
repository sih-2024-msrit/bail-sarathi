import {createSlice} from "@reduxjs/toolkit"

const initialState={
    user:localStorage.getItem("user") ? localStorage.getItem("user"):null,
    loading:false,
}


const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
        },
        setLoading(state,value){
            state.loading=value.payload
        },

    }
})

export const {setUser, setLoading}=authSlice.actions

export default userSlice.reducer;