// Client-side analytics tracking
"use client"

class ClientAnalytics {
  private static instance: ClientAnalytics
  private sessionId: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.setupPageTracking()
  }

  static getInstance(): ClientAnalytics {
    if (!ClientAnalytics.instance) {
      ClientAnalytics.instance = new ClientAnalytics()
    }
    return ClientAnalytics.instance
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private setupPageTracking() {
    // Track initial page load
    this.trackPageView()

    // Track page changes in SPA
    let currentPath = window.location.pathname
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname
        this.trackPageView()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackEvent('page_focus')
      } else {
        this.trackEvent('page_blur')
      }
    })

    // Track session duration on page unload
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - this.startTime
      this.trackEvent('session_end', { duration })
    })
  }

  async trackPageView(page?: string) {
    const currentPage = page || window.location.pathname
    await this.sendEvent({
      type: 'page_view',
      page: currentPage,
      metadata: {
        referrer: document.referrer,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }
    })
  }

  async trackEvent(action: string, metadata?: Record<string, any>) {
    await this.sendEvent({
      type: 'custom',
      action,
      page: window.location.pathname,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }
    })
  }

  async trackUserAction(action: string, metadata?: Record<string, any>) {
    await this.sendEvent({
      type: 'custom',
      action: `user_${action}`,
      page: window.location.pathname,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }
    })
  }

  private async sendEvent(eventData: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }
}

// Export singleton instance
export const analytics = typeof window !== 'undefined' ? ClientAnalytics.getInstance() : null

// Helper functions for easy tracking
export const trackPageView = (page?: string) => {
  analytics?.trackPageView(page)
}

export const trackEvent = (action: string, metadata?: Record<string, any>) => {
  analytics?.trackEvent(action, metadata)
}

export const trackUserAction = (action: string, metadata?: Record<string, any>) => {
  analytics?.trackUserAction(action, metadata)
}