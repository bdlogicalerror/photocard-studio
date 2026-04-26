import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8003',
  headers: {
    'Content-Type': 'application/json',
  },
})

import { toast } from 'sonner'

// ... (config)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred'
    const detail = error.response?.data?.detail
    
    toast.error(message, {
      description: detail,
      duration: 5000,
    })
    
    return Promise.reject(error)
  }
)

export default api
