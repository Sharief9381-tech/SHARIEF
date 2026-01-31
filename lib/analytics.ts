// Analytics tracking system
import { getDatabase, isDatabaseAvailable } from '@/lib/database'
import { ObjectId } from 'mongodb'

export interface AnalyticsEvent {
  _id?: string | ObjectId
  type: 'page_view' | 'user_signup' | 'user_login' | 'platform_link' | 'custom'
  userId?: string
  userRole?: string
  page?: string
  action?: string
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  timestamp: Date
  sessionId?: string
}

export interface VisitorInfo {
  ip: string
  userAgent: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
}

export class Analytics {
  private static collection = 'analytics'

  // Track an event
  static async track(event: Omit<AnalyticsEvent, 'timestamp'>, visitorInfo?: VisitorInfo) {
    try {
      const analyticsEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date(),
        ip: visitorInfo?.ip,
        userAgent: visitorInfo?.userAgent,
      }

      if (isDatabaseAvailable()) {
        const db = await getDatabase()
        // Create a document without the _id field for MongoDB insertion
        const { _id, ...documentToInsert } = analyticsEvent
        await db.collection(this.collection).insertOne(documentToInsert)
      } else {
        // Store in memory for fallback
        this.storeInMemory(analyticsEvent)
      }

      console.log('📊 Analytics event tracked:', event.type, event.page || event.action)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Get analytics data
  static async getAnalytics(timeRange: 'today' | 'week' | 'month' | 'all' = 'week') {
    try {
      let startDate: Date
      const now = new Date()

      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0) // All time
      }

      if (isDatabaseAvailable()) {
        const db = await getDatabase()
        const events = await db.collection(this.collection)
          .find({ timestamp: { $gte: startDate } })
          .sort({ timestamp: -1 })
          .toArray()

        // Convert MongoDB documents to AnalyticsEvent objects
        const analyticsEvents: AnalyticsEvent[] = events.map(doc => ({
          _id: doc._id?.toString(),
          type: doc.type,
          userId: doc.userId,
          userRole: doc.userRole,
          page: doc.page,
          action: doc.action,
          metadata: doc.metadata,
          ip: doc.ip,
          userAgent: doc.userAgent,
          timestamp: doc.timestamp,
          sessionId: doc.sessionId
        }))

        return this.processAnalyticsData(analyticsEvents)
      } else {
        const events = this.getFromMemory().filter(e => e.timestamp >= startDate)
        return this.processAnalyticsData(events)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return this.getEmptyAnalytics()
    }
  }

  // Process raw analytics data into useful metrics
  private static processAnalyticsData(events: AnalyticsEvent[]) {
    const totalEvents = events.length
    const uniqueVisitors = new Set(events.map(e => e.ip).filter(Boolean)).size
    const pageViews = events.filter(e => e.type === 'page_view').length
    const signups = events.filter(e => e.type === 'user_signup').length
    const logins = events.filter(e => e.type === 'user_login').length

    // Top pages
    const pageViewEvents = events.filter(e => e.type === 'page_view')
    const pageStats: Record<string, number> = {}
    pageViewEvents.forEach(e => {
      if (e.page) {
        pageStats[e.page] = (pageStats[e.page] || 0) + 1
      }
    })
    const topPages = Object.entries(pageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // User roles breakdown
    const roleStats: Record<string, number> = {}
    events.filter(e => e.userRole).forEach(e => {
      if (e.userRole) {
        roleStats[e.userRole] = (roleStats[e.userRole] || 0) + 1
      }
    })

    // Recent activity
    const recentActivity = events
      .slice(0, 20)
      .map(e => ({
        type: e.type,
        page: e.page,
        action: e.action,
        userRole: e.userRole,
        timestamp: e.timestamp,
        ip: e.ip ? this.maskIP(e.ip) : undefined
      }))

    // Hourly activity (last 24 hours)
    const hourlyActivity: Record<string, number> = {}
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    events
      .filter(e => e.timestamp >= last24Hours)
      .forEach(e => {
        const hour = e.timestamp.getHours()
        hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1
      })

    return {
      summary: {
        totalEvents,
        uniqueVisitors,
        pageViews,
        signups,
        logins,
      },
      topPages,
      roleStats,
      recentActivity,
      hourlyActivity,
      timeRange: events.length > 0 ? {
        start: events[events.length - 1]?.timestamp,
        end: events[0]?.timestamp
      } : null
    }
  }

  // Mask IP for privacy
  private static maskIP(ip: string): string {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`
    }
    return 'xxx.xxx.xxx.xxx'
  }

  // In-memory storage for fallback
  private static memoryStore: AnalyticsEvent[] = []

  private static storeInMemory(event: AnalyticsEvent) {
    this.memoryStore.push(event)
    // Keep only last 1000 events in memory
    if (this.memoryStore.length > 1000) {
      this.memoryStore = this.memoryStore.slice(-1000)
    }
  }

  private static getFromMemory(): AnalyticsEvent[] {
    return [...this.memoryStore]
  }

  private static getEmptyAnalytics() {
    return {
      summary: {
        totalEvents: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        signups: 0,
        logins: 0,
      },
      topPages: [],
      roleStats: {},
      recentActivity: [],
      hourlyActivity: {},
      timeRange: null
    }
  }
}

// Helper function to get visitor info from request
export function getVisitorInfo(request: Request): VisitorInfo {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  return {
    ip: Array.isArray(ip) ? ip[0] : ip,
    userAgent,
    // Additional parsing can be added here for device/browser detection
  }
}