import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { bailoutEndpoints } from "../api"
import { setBailout } from "../../slices/summarySlice";

const {
    BAILOUT_API,
    GET_BAILOUT_STATUS,
    BAIL_SUMMARY_API
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
            toast.success("Bailout Successful")
            navigate("/status")
        } catch (error) {
            console.log("BAILOUT API ERROR............", error)
            toast.error(`Bailout Failed ${error.message}`)
        }
        toast.dismiss(toastId)
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
            setBailout(response.data.bailout)
        } catch (error) {
            console.log("BAILOUT STATUS API ERROR............", error)
            toast.error(`Bailout Status Failed ${error.message}`)
        }
        toast.dismiss(toastId)
    }
}


export function bailSummary(data) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("POST", BAIL_SUMMARY_API, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Bail Summary Successful Fetched")
        } catch (error) {
            console.log("BAILOUT SUMMARY API ERROR............", error)
            toast.error(`Bail Summary Failed ${error.message}`)
        }
        toast.dismiss(toastId)
    }
}