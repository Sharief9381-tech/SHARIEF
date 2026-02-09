import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Database, Users, BarChart3, Globe } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getSystemStatus() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/debug/test-system`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch system status:', error)
  }
  return null
}

function StatusIcon({ status }: { status: 'PASS' | 'FAIL' | 'WARN' }) {
  switch (status) {
    case 'PASS':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'WARN':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case 'FAIL':
      return <XCircle className="h-5 w-5 text-red-500" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PASS':
      return 'bg-green-500/20 text-green-500'
    case 'WARN':
      return 'bg-yellow-500/20 text-yellow-500'
    case 'FAIL':
      return 'bg-red-500/20 text-red-500'
    default:
      return 'bg-gray-500/20 text-gray-500'
  }
}

function getOverallStatusColor(status: string) {
  switch (status) {
    case 'ALL_SYSTEMS_GO':
      return 'bg-green-500/20 text-green-500 border-green-500/30'
    case 'MINOR_ISSUES':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    case 'CRITICAL_ISSUES':
      return 'bg-red-500/20 text-red-500 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
  }
}

export default async function StatusPage() {
  const systemStatus = await getSystemStatus()

  if (!systemStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">System Status Unavailable</h1>
            <p className="text-muted-foreground">Unable to fetch system status</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CodeTrack System Status</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of all system components
          </p>
        </div>

        {/* Overall Status */}
        <Card className={`mb-8 border-2 ${getOverallStatusColor(systemStatus.overallStatus)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {systemStatus.overallStatus === 'ALL_SYSTEMS_GO' && '✅ All Systems Operational'}
                  {systemStatus.overallStatus === 'MINOR_ISSUES' && '⚠️ Minor Issues Detected'}
                  {systemStatus.overallStatus === 'CRITICAL_ISSUES' && '🔴 Critical Issues Found'}
                </h2>
                <p className="text-sm opacity-80">
                  Last checked: {new Date(systemStatus.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {systemStatus.summary.passed}/{systemStatus.summary.total}
                </div>
                <div className="text-sm opacity-80">Tests Passing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Passed</span>
              </div>
              <p className="text-2xl font-bold mt-2">{systemStatus.summary.passed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Warnings</span>
              </div>
              <p className="text-2xl font-bold mt-2">{systemStatus.summary.warnings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Failed</span>
              </div>
              <p className="text-2xl font-bold mt-2">{systemStatus.summary.failed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Total Tests</span>
              </div>
              <p className="text-2xl font-bold mt-2">{systemStatus.summary.total}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              System Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.tests.map((test: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={test.status} />
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-muted-foreground">{test.message}</div>
                      {test.details && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(test.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {systemStatus.recommendations && systemStatus.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemStatus.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <a href="/admin">Admin Dashboard</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/api/debug/test-system" target="_blank">View Raw Status</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/api/debug/generate-demo-data" target="_blank">Generate Demo Data</a>
          </Button>
        </div>
      </div>
    </div>
  )
}