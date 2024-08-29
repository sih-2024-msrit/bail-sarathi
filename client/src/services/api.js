const BASE_URL = "http://localhost:4000/api/v1"


export const authEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
}

export const summaryEndpoints = {
    GET_SUMMARY: BASE_URL + "/summary",
}

export const bailoutEndpoints = {
    SEND_BAILOUT: BASE_URL + "/bailout",
    GET_BAILOUT_STATUS: BASE_URL + "/bailout-status",
}