import api from '@/lib/axios'
import { PhotocardCreate, PhotocardResponse } from '@/types/photocard'

export const photocardApi = {
  generate: async (data: PhotocardCreate): Promise<PhotocardResponse> => {
    const response = await api.post<PhotocardResponse>('/api/v1/generate/', data)
    return response.data
  },
}
