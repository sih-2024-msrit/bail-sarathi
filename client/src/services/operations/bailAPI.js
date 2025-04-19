import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { bailoutEndpoints } from "../api"
import { 
    setBailout,
    fetchSummaryStart,
    fetchSummarySuccess,
    fetchSummaryFailure 
} from "../../slices/summarySlice";

const {
    BAILOUT_API,
    GET_BAILOUT_STATUS,
    BAIL_SUMMARY_API,
    TEST_CHATBOT_API
} = bailoutEndpoints;


export function bailout(bailoutData, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("POST", BAILOUT_API, bailoutData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Bail Applied Successfully")
            navigate("/admin")
        } catch (error) {
            console.log("BAILOUT APPLY API ERROR............", error)
            toast.error(error?.response?.data?.message || `Bail Apply Failed`)
        } finally {
            toast.dismiss(toastId)
        }
    }
}


export function getBailoutStatus(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("GET", GET_BAILOUT_STATUS, null,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setBailout(response.data.bailout))
        } catch (error) {
            console.log("BAILOUT STATUS API ERROR............", error)
            toast.error(`Bailout Status Failed`)
        } finally {
            toast.dismiss(toastId)
        }
    }
}


export function bailSummary(data) {
    return async (dispatch) => {
        dispatch(fetchSummaryStart())
        const toastId = toast.loading("Fetching Summary...")
        try {
            const response = await apiConnector("POST", BAIL_SUMMARY_API, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch bail summary")
            }
            dispatch(fetchSummarySuccess(response.data.bailDetails))
            toast.success("Summary Fetched")
        } catch (error) {
            console.log("BAILOUT SUMMARY API ERROR............", error)
            const errorMessage = error?.response?.data?.message || error.message || "Bail Summary Failed"
            dispatch(fetchSummaryFailure(errorMessage))
            toast.error(errorMessage)
        } finally {
            toast.dismiss(toastId)
        }
    }
}