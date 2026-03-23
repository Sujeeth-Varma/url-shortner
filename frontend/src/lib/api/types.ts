export interface GenericResponse<T> {
  response: T
  message?: string
}

export interface SignupRequest {
  username: string
  email: string
  password?: string
}

export interface SigninRequest {
  username: string
  password?: string
}

export interface JwtAuthenticationResponse {
  token: string
}

export interface UrlRequest {
  longUrl: string
}

export interface UrlMappingDto {
  originalUrl: string
  shortUrl: string
  id: number
  clicks: number
  createdAt: string // ISO string
  username: string
}

export interface ClickEventDto {
  id: number
  clickDate: string // "YYYY-MM-DD"
  count: number
}
