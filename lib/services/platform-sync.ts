import { UserModel } from '@/lib/models/user'
import { LeetCodeAPI, CodeforcesAPI, GitHubAPI, CodeChefAPI, HackerRankAPI, HackerEarthAPI } from '@/lib/platforms/api-client'
import type { StudentProfile } from '@/lib/types'

export interface PlatformSyncResult {
  platform: string
  success: boolean
  data?: any
  error?: string
}

export class PlatformSyncService {
  static async syncUserPlatforms(userId: string): Promise<PlatformSyncResult[]> {
    const user = await UserModel.findById(userId)
    if (!user || user.role !== 'student') {
      throw new Error('User not found or not a student')
    }

    const student = user as any // Use any to avoid type issues
    const results: PlatformSyncResult[] = []

    // Initialize linkedPlatforms if it doesn't exist
    if (!student.linkedPlatforms) {
      await UserModel.update(userId, { linkedPlatforms: {} })
      student.linkedPlatforms = {}
    }

    // Initialize stats if it doesn't exist
    if (!student.stats) {
      await UserModel.update(userId, { 
        stats: {
          totalProblems: 0,
          easyProblems: 0,
          mediumProblems: 0,
          hardProblems: 0,
          githubContributions: 0,
          contestsParticipated: 0,
          rating: 0
        }
      })
    }

    // Sync LeetCode
    if (student.linkedPlatforms?.leetcode?.username) {
      try {
        const stats = await LeetCodeAPI.getUserStats(student.linkedPlatforms.leetcode.username)
        if (stats) {
          await UserModel.update(userId, {
            'stats.totalProblems': stats.totalProblems,
            'stats.easyProblems': stats.easyProblems,
            'stats.mediumProblems': stats.mediumProblems,
            'stats.hardProblems': stats.hardProblems,
            'linkedPlatforms.leetcode.lastSync': new Date(),
            'linkedPlatforms.leetcode.stats': stats
          })
          results.push({ platform: 'leetcode', success: true, data: stats })
        } else {
          results.push({ platform: 'leetcode', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'leetcode', success: false, error: error.message })
      }
    }

    // Sync Codeforces
    if (student.linkedPlatforms?.codeforces?.username) {
      try {
        const stats = await CodeforcesAPI.getUserStats(student.linkedPlatforms.codeforces.username)
        if (stats) {
          await UserModel.update(userId, {
            'stats.rating': Math.max(student.stats?.rating || 0, stats.rating),
            'linkedPlatforms.codeforces.lastSync': new Date(),
            'linkedPlatforms.codeforces.stats': stats
          })
          results.push({ platform: 'codeforces', success: true, data: stats })
        } else {
          results.push({ platform: 'codeforces', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'codeforces', success: false, error: error.message })
      }
    }

    // Sync GitHub
    if (student.linkedPlatforms?.github?.username) {
      try {
        const stats = await GitHubAPI.getUserStats(student.linkedPlatforms.github.username)
        if (stats) {
          await UserModel.update(userId, {
            'stats.githubContributions': stats.contributions,
            'linkedPlatforms.github.lastSync': new Date(),
            'linkedPlatforms.github.stats': stats
          })
          results.push({ platform: 'github', success: true, data: stats })
        } else {
          results.push({ platform: 'github', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'github', success: false, error: error.message })
      }
    }

    // Sync CodeChef
    if (student.linkedPlatforms?.codechef?.username) {
      try {
        const stats = await CodeChefAPI.getUserStats(student.linkedPlatforms.codechef.username)
        if (stats) {
          await UserModel.update(userId, {
            'linkedPlatforms.codechef.lastSync': new Date(),
            'linkedPlatforms.codechef.stats': stats
          })
          results.push({ platform: 'codechef', success: true, data: stats })
        } else {
          results.push({ platform: 'codechef', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'codechef', success: false, error: error.message })
      }
    }

    // Sync HackerRank
    if (student.linkedPlatforms?.hackerrank?.username) {
      try {
        const stats = await HackerRankAPI.getUserStats(student.linkedPlatforms.hackerrank.username)
        if (stats) {
          await UserModel.update(userId, {
            'linkedPlatforms.hackerrank.lastSync': new Date(),
            'linkedPlatforms.hackerrank.stats': stats
          })
          results.push({ platform: 'hackerrank', success: true, data: stats })
        } else {
          results.push({ platform: 'hackerrank', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'hackerrank', success: false, error: error.message })
      }
    }

    // Sync HackerEarth
    if (student.linkedPlatforms?.hackerearth?.username) {
      try {
        const stats = await HackerEarthAPI.getUserStats(student.linkedPlatforms.hackerearth.username)
        if (stats) {
          await UserModel.update(userId, {
            'linkedPlatforms.hackerearth.lastSync': new Date(),
            'linkedPlatforms.hackerearth.stats': stats
          })
          results.push({ platform: 'hackerearth', success: true, data: stats })
        } else {
          results.push({ platform: 'hackerearth', success: false, error: 'Failed to fetch data' })
        }
      } catch (error: any) {
        results.push({ platform: 'hackerearth', success: false, error: error.message })
      }
    }

    return results
  }

  static async linkPlatform(userId: string, platform: string, username: string): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {}
      updateData[`linkedPlatforms.${platform}`] = {
        username,
        linkedAt: new Date(),
        isActive: true
      }

      await UserModel.update(userId, updateData)
      
      // Immediately sync the new platform
      await this.syncUserPlatforms(userId)
      
      return true
    } catch (error) {
      console.error('Error linking platform:', error)
      return false
    }
  }

  static async unlinkPlatform(userId: string, platform: string): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {}
      updateData[`linkedPlatforms.${platform}`] = null

      await UserModel.update(userId, updateData)
      return true
    } catch (error) {
      console.error('Error unlinking platform:', error)
      return false
    }
  }

  static async scheduleSync(userId: string): Promise<void> {
    // This would integrate with a job queue system like Bull or Agenda
    // For now, we'll just sync immediately
    await this.syncUserPlatforms(userId)
  }
}