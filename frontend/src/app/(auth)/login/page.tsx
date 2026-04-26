'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/store/LanguageContext'
import { toast } from 'sonner'

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-950">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          {t.backToHome}
        </Link>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-4 text-white">Welcome Back</h1>
            <p className="text-zinc-500">Sign in to manage your photocards and assets.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-red-500 transition-all text-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <Link href="/reset-password" title="Forgot Password" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  required
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-red-500 transition-all text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-zinc-500 text-sm">
            Don't have an account? <Link href="/signup" className="text-white font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block relative overflow-hidden bg-zinc-900 border-l border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-blue-600/10 z-10" />
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="relative w-full aspect-square max-w-lg">
            <div className="absolute inset-0 bg-zinc-800 rounded-[3rem] rotate-6 border border-zinc-700/50" />
            <div className="absolute inset-0 bg-zinc-950 rounded-[3rem] -rotate-3 border border-zinc-800 shadow-2xl flex flex-col p-8 overflow-hidden">
               {/* Mock Card UI */}
               <div className="h-2/3 bg-zinc-900 rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-2 w-20 bg-red-600 mb-3" />
                    <div className="h-4 w-full bg-white/20 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-white/20 rounded" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-3 w-1/3 bg-zinc-800 rounded" />
                  <div className="h-3 w-full bg-zinc-900 rounded" />
                  <div className="h-3 w-full bg-zinc-900 rounded" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
