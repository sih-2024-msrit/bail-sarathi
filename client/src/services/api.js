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
    BAIL_APPLY_API:BASE_URL+ "/bailout/bail-apply",
    TEST_FLASK_API:BASE_URL + "/bailout/test-flask",
    BAIL_SUMMARY_API:BASE_URL + "/bailout/bail-summary",
    LAWYER_BAIL_API:BASE_URL + "/bailout/get-lawyer-bails",
    JUDGE_BAIL_API:BASE_URL + "/bailout/get-judge-bails",
    TEST_CHATBOT_API:BASE_URL + "/bailout/test-chatbot",
}