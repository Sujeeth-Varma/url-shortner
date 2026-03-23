import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ClipLink_jwt")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("ClipLink_jwt")
      if (
        window.location.pathname !== "/signin" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/signin"
      }
    }
    return Promise.reject(error)
  }
)
