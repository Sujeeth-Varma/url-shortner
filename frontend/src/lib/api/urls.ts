import { apiClient } from "./client"
import type {
  UrlRequest,
  UrlMappingDto,
  GenericResponse,
  ClickEventDto,
} from "./types"

export const urlsApi = {
  createShortUrl: async (data: UrlRequest) => {
    // wait what does it return? Probably UrlMappingDto
    const response = await apiClient.post<GenericResponse<UrlMappingDto>>(
      "/urls/shorturl",
      data
    )
    return response.data
  },
  getMyUrls: async () => {
    const response =
      await apiClient.get<GenericResponse<UrlMappingDto[]>>("/urls/myurls") // wait check
    return response.data
  },
  getAnalytics: async (
    shortUrl: string,
    startDate: string,
    endDate: string
  ) => {
    const response = await apiClient.get<GenericResponse<ClickEventDto[]>>(
      `/urls/analytics/${shortUrl}`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data
  },
  getTotalClicks: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<
      GenericResponse<Record<string, number>>
    >("/urls/totalClicks", {
      params: { startDate, endDate },
    })
    return response.data
  },
}
