import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { photocardApi } from '@/api/photocard'
import { PhotocardCreate, PhotocardResponse } from '@/types/photocard'

export const useGeneratePhotocard = () => {
  return useMutation<PhotocardResponse, Error, PhotocardCreate | FormData>({
    mutationFn: async (data) => {
      const { data: { session } } = await supabase.auth.getSession()
      return photocardApi.generate(data, session?.user?.id)
    },
    onSuccess: (data) => {
      // Logic handled in component handleAction
    },
    onError: (error: any) => {
      console.error('Generation failed:', error)
      let message = 'Generation Failed'
      
      const detail = error.response?.data?.detail
      if (Array.isArray(detail)) {
        // Handle Pydantic validation errors
        message = detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ')
      } else if (typeof detail === 'string') {
        message = detail
      } else {
        message = error.message || 'Generation Failed'
      }
      
      toast.error(message)
    },
  })
}
