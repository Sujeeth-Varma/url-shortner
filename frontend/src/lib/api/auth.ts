import { apiClient } from "./client"
import type {
  SignupRequest,
  SigninRequest,
  JwtAuthenticationResponse,
} from "./types"

export const authApi = {
  signup: async (data: SignupRequest) => {
    // Returns string "User registered" or throws
    const response = await apiClient.post<string>("/auth/public/signup", data)
    return response.data
  },
  signin: async (data: SigninRequest) => {
    const response = await apiClient.post<JwtAuthenticationResponse>(
      "/auth/public/signin",
      data
    )
    return response.data
  },
}
