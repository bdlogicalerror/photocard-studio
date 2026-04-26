'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ReactNode } from 'react'

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
