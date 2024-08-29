import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { authEndpoints } from "../api"

const {
    LOGIN_API,
    RESETPASSWORD_API,
  } = authEndpoints;

  export function login(email, password, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        })
  
        
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))
        const userImage = response.data?.user?.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.name}`
        dispatch(setUser({ ...response.data.user, image: userImage }))
        localStorage.setItem("token", JSON.stringify(response.data.token))
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/feed")
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error(`Login Failed ${error.message}`)
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }


  export function resetPassword(password, confirmPassword, token, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", RESETPASSWORD_API, {
          password,
          confirmPassword,
          token,
        })
  
        
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        toast.success("Password Reset Successfully")
        navigate("/")
      } catch (error) {
        console.log("RESETPASSWORD ERROR............", error)
        toast.error("Failed To Reset Password")
      }
      toast.dismiss(toastId)
      dispatch(setLoading(false))
    }
  }


  
export function logout(navigate) {
    return async(dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged Out")
      navigate("/")
    }
  }
  




