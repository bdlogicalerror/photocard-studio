import { useMutation } from '@tanstack/react-query'
import { photocardApi } from '@/api/photocard'
import { PhotocardCreate, PhotocardResponse } from '@/types/photocard'

export const useGeneratePhotocard = () => {
  return useMutation<PhotocardResponse, Error, PhotocardCreate>({
    mutationFn: (data) => photocardApi.generate(data),
    onSuccess: (data) => {
      // Logic handled in component handleAction
    },
    onError: (error) => {
      console.error('Generation failed:', error)
      alert(`Generation Failed: ${error.message}`)
    },
  })
}
