"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle, Clock, Database } from "lucide-react"

interface DataSourceStatusProps {
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  isUsingFallback: boolean
  onRefresh: () => void
  spreadsheetUrl: string
}

export default function DataSourceStatus({
  loading,
  error,
  lastUpdated,
  isUsingFallback,
  onRefresh,
  spreadsheetUrl,
}: DataSourceStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusIcon = () => {
    if (loading || isRefreshing) return <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
    if (error) return <AlertCircle className="w-4 h-4 text-red-400" />
    if (isUsingFallback) return <Database className="w-4 h-4 text-yellow-400" />
    return <CheckCircle className="w-4 h-4 text-green-400" />
  }

  const getStatusText = () => {
    if (loading) return "Loading data..."
    if (error) return `Error: ${error}`
    if (isUsingFallback) return "Using local data (spreadsheet not accessible)"
    if (lastUpdated) return `Connected to Google Sheets`
    return "Ready"
  }

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-cyan-50 flex items-center gap-2">
          {getStatusIcon()}
          Data Source Status
        </CardTitle>
        <CardDescription className="text-cyan-200 text-xs">{getStatusText()}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => window.open(spreadsheetUrl, "_blank")}
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Sheet
          </Button>
        </div>
        {lastUpdated && !isUsingFallback && (
          <div className="flex items-center gap-1 mt-2 text-xs text-green-300">
            <Clock className="w-3 h-3" />
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}
        {isUsingFallback && (
          <div className="flex items-center gap-1 mt-2 text-xs text-yellow-300">
            <Database className="w-3 h-3" />
            Using local data - Make sure your Google Sheet is public or shared
          </div>
        )}
      </CardContent>
    </Card>
  )
}
