"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/client-analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    if (analytics) {
      analytics.trackPageView(pathname)
    }
  }, [pathname])

  useEffect(() => {
    // Track signup events
    const handleSignup = () => {
      analytics?.trackEvent('user_signup_completed')
    }

    // Track login events
    const handleLogin = () => {
      analytics?.trackEvent('user_login_completed')
    }

    // Listen for custom events
    window.addEventListener('user_signup', handleSignup)
    window.addEventListener('user_login', handleLogin)

    return () => {
      window.removeEventListener('user_signup', handleSignup)
      window.removeEventListener('user_login', handleLogin)
    }
  }, [])

  return <>{children}</>
}