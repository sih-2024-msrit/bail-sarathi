const BASE_URL = "http://localhost:4000/api/v1"


export const authEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API:BASE_URL + "/auth/signup"
}

export const summaryEndpoints = {
    GET_SUMMARY: BASE_URL + "/summary/summary",
}

export const bailoutEndpoints = {
    SEND_BAILOUT: BASE_URL + "/bailout/bailout",
    GET_BAILOUT_STATUS: BASE_URL + "/bailout/bailout-status",
}