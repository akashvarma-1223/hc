import axios from "axios"
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ This ensures cookies are sent and received
  headers: {
    "Content-Type": "application/json",
  },
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export default api

