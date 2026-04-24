// src/app/(studio)/layout.tsx
import Header from '@/components/Header'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header />
      <main className="flex-1 relative pt-12 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
