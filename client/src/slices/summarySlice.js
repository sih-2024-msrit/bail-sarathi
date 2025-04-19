import {createSlice} from "@reduxjs/toolkit"
// import { bailout } from "../services/operations/BailAPI"

const initialState={
    details: null,
    loading: false,
    error: null,
    bailout: localStorage.getItem("bailout") ? localStorage.getItem("bailout"):null
}


const summarySlice = createSlice({
    name:"summary",
    initialState:initialState,
    reducers:{
        fetchSummaryStart(state) {
            state.loading = true;
            state.error = null;
            state.details = null; // Clear previous details on new fetch
        },
        fetchSummarySuccess(state, action) {
            state.loading = false;
            state.details = action.payload; // Payload should be the bailDetails object
        },
        fetchSummaryFailure(state, action) {
            state.loading = false;
            state.error = action.payload; // Payload should be the error message
        },
        clearSummaryDetails(state) {
            state.details = null;
            state.loading = false;
            state.error = null;
        },
        setBailout(state,value){
            state.bailout=value.payload
        }
    }
})

export const {
    fetchSummaryStart,
    fetchSummarySuccess,
    fetchSummaryFailure,
    clearSummaryDetails,
    setBailout
} = summarySlice.actions

export default summarySlice.reducer;