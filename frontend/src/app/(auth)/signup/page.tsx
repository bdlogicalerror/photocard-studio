'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useLanguage } from '@/store/LanguageContext'
import { toast } from 'sonner'

export default function SignupPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Registration successful! Please check your email for verification.')
      setLoading(false)
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
            <h1 className="text-4xl font-black tracking-tight mb-4 text-white">Join News Studio</h1>
            <p className="text-zinc-500">Start creating professional news photocards today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-red-500 transition-all text-white"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
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
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-zinc-500 text-sm">
            Already have an account? <Link href="/login" className="text-white font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual (Same as Login) */}
      <div className="hidden lg:block relative overflow-hidden bg-zinc-900 border-l border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-blue-600/10 z-10" />
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="relative w-full aspect-square max-w-lg">
            <div className="absolute inset-0 bg-zinc-800 rounded-[3rem] rotate-6 border border-zinc-700/50" />
            <div className="absolute inset-0 bg-zinc-950 rounded-[3rem] -rotate-3 border border-zinc-800 shadow-2xl flex flex-col p-8 overflow-hidden">
               <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Zap size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Instant News Graphics</h2>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto">Elevate your reporting with professionally designed photocards in seconds.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
