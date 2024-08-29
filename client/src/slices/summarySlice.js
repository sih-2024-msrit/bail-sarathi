import {createSlice} from "@reduxjs/toolkit"
import { bailout } from "../services/operations/BailAPI"

const initialState={
    summary:localStorage.getItem("summary") ? localStorage.getItem("summary"):null,
    loading:false,
    bailout: localStorage.getItem("bailout") ? localStorage.getItem("bailout"):null
}


const summarySlice = createSlice({
    name:"summary",
    initialState:initialState,
    reducers:{
        setSummary(state,value){
            state.summary=value.payload
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setBailout(state,value){
            state.bailout=value.payload
        }
    }
})

export const {setSummary, setLoading, setBailout}=authSlice.actions

export default summarySlice.reducer;