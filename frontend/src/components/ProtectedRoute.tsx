'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isOwner, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isOwner) {
      router.replace('/studio')
    }
  }, [isOwner, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!isOwner) return null

  return <>{children}</>
}
