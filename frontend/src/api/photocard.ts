import api from '@/lib/axios'
import { PhotocardCreate, PhotocardResponse } from '@/types/photocard'

export const photocardApi = {
  generate: async (data: PhotocardCreate | FormData, userId?: string): Promise<PhotocardResponse> => {
    const headers: any = {}
    if (userId) headers['X-User-ID'] = userId
    
    // Axios handles Content-Type automatically for FormData
    const response = await api.post<PhotocardResponse>('/api/v1/generate/', data, { headers })
    return response.data
  },
  save: async (data: { filename: string; template_id: string; headline: string; card_data: any; shield_id?: string }, userId: string) => {
    const response = await api.post('/api/v1/photocards/save', data, {
      headers: { 'X-User-ID': userId }
    })
    return response.data
  },
  checkStatus: async (jobId: string) => {
    const response = await api.get(`/api/v1/generate/status/${jobId}`)
    return response.data
  }
}
