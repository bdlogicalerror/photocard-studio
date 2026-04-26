import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8003',
})

import { toast } from 'sonner'

// ... (config)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = error.response?.data?.error || error.message || 'An unexpected error occurred'
    let detail = error.response?.data?.detail
    
    // Format Pydantic validation errors if present
    if (Array.isArray(detail)) {
      detail = detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ')
    } else if (typeof detail === 'object' && detail !== null) {
      detail = JSON.stringify(detail)
    }

    toast.error(message, {
      description: detail,
      duration: 5000,
    })
    
    return Promise.reject(error)
  }
)

export default api
