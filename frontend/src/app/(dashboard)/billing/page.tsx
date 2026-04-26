'use client'
import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/store/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Check, Zap, Crown, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BillingPage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
    setLoading(false)
  }

  const handleRequestUpgrade = async (tier: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ 
        subscription_tier: tier,
        subscription_status: 'pending' 
      })
      .eq('id', user.id)
    
    fetchProfile()
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: ['5 Cards / Day', 'Standard Templates', '720p Export', 'Public Gallery'],
      icon: Zap,
      color: 'bg-zinc-800'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9/mo',
      features: ['Unlimited Cards', 'Premium Templates', '4K High-Res Export', 'Private Gallery', 'Priority Support'],
      icon: Crown,
      color: 'bg-red-600',
      highlight: true
    }
  ]

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-10 w-48 bg-zinc-900 rounded-lg" />
    <div className="grid gap-6 md:grid-cols-2">
      <div className="h-96 bg-zinc-900 rounded-3xl" />
      <div className="h-96 bg-zinc-900 rounded-3xl" />
    </div>
  </div>

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">{t.billing}</h1>
        <p className="text-zinc-500">{t.activePlan}: <span className="text-white font-bold uppercase">{profile?.subscription_tier || 'Free'}</span></p>
      </div>

      {profile?.subscription_status === 'pending' && (
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-4 text-yellow-500">
          <Clock size={20} />
          <p className="font-medium">{t.pendingApproval}</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
        {plans.map((plan) => {
          const isCurrent = (profile?.subscription_tier || 'free') === plan.id
          return (
            <div 
              key={plan.id}
              className={cn(
                "relative p-8 rounded-[2.5rem] border transition-all flex flex-col",
                plan.highlight ? "bg-zinc-900/40 border-red-500/30 shadow-2xl shadow-red-900/10" : "bg-zinc-900/20 border-zinc-800",
                isCurrent && "border-red-500 ring-1 ring-red-500"
              )}
            >
              {isCurrent && (
                <div className="absolute -top-3 right-8 px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Current Plan
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={cn("p-3 rounded-2xl", plan.color)}>
                  <plan.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-2xl font-black tracking-tighter">{plan.price}<span className="text-sm font-medium text-zinc-500">/month</span></p>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                      <Check size={12} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                disabled={isCurrent || profile?.subscription_status === 'pending'}
                onClick={() => handleRequestUpgrade(plan.id)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02]",
                  isCurrent 
                    ? "bg-zinc-800 text-zinc-500 cursor-default" 
                    : plan.highlight 
                      ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20" 
                      : "bg-white text-black hover:bg-zinc-200"
                )}
              >
                {isCurrent ? "Current Plan" : profile?.subscription_status === 'pending' ? t.pendingApproval : t.upgradeToPro}
              </button>
            </div>
          )
        })}
      </div>

      <div className="max-w-5xl p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800 flex items-start gap-6">
        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">How billing works in Bangladesh?</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Since international payments can be tricky, we currently use a manual approval process. 
            Once you request an upgrade, please contact our team via WhatsApp or Email to complete the payment. 
            Our admin will activate your Pro features within 1-2 hours of payment verification.
          </p>
        </div>
      </div>
    </div>
  )
}
