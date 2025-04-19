const BASE_URL = "http://localhost:5001/api"


export const authEndpoints = {
    LOGIN_API: BASE_URL + "/login",
    SIGNUP_API:BASE_URL + "/signup"
}


export const bailoutEndpoints = {
    BAIL_APPLY_API:BASE_URL + "/create-application",
    LAWYER_BAIL_API:BASE_URL + "/get-lawyer-bails",
    STATUS_CHANGE:BASE_URL + "/change-status",
    TEST_CHATBOT_API:BASE_URL + "/test-chatbot",
    BAIL_SUMMARY_API:BASE_URL + "/bail-summary",
    JUDGE_BAIL_API:BASE_URL + "/get-judge-bails"
}