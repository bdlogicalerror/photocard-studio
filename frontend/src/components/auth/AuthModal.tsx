'use client'
import { useState } from 'react'
import { X, Mail, Lock, User, Github } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'signup'
  limitReached?: boolean
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', limitReached = false }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (activeTab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        })
        if (error) throw error
        toast.success('Check your email for confirmation!')
        onClose()
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Logged in successfully!')
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#1E1E24] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('login')}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all",
              activeTab === 'login' ? "text-red-500 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            LOGIN
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all",
              activeTab === 'signup' ? "text-red-500 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            SIGNUP
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            {limitReached && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm">
                <span className="font-bold block mb-1">Guest Limit Reached</span>
                Please create a free account or log in to continue generating unlimited photocards.
              </div>
            )}
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {activeTab === 'login' ? 'Login to access your saved photocards' : 'Join thousands of creators worldwide'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl shadow-lg shadow-red-600/10 active:scale-[0.98] transition-all uppercase tracking-widest text-sm mt-4"
            >
              {isLoading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-[#1E1E24] px-4 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl border border-zinc-800 transition-all font-bold text-sm"
            >
              <Github size={20} />
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] text-zinc-500 leading-relaxed">
            By continuing, you agree to Photocard's <span className="text-zinc-400 underline cursor-pointer">Terms of Service</span> and <span className="text-zinc-400 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
