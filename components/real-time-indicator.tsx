"use client"

import { useEffect, useState } from "react"
import { WifiOff, RefreshCw, Zap, CheckCircle } from "lucide-react"

interface RealTimeIndicatorProps {
  isConnected: boolean
  lastUpdated: Date | null
  isLoading: boolean
  connectionMethod?: string
}

export default function RealTimeIndicator({
  isConnected,
  lastUpdated,
  isLoading,
  connectionMethod,
}: RealTimeIndicatorProps) {
  const [showPulse, setShowPulse] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  // Show pulse animation when data updates
  useEffect(() => {
    if (lastUpdated) {
      setShowPulse(true)
      setUpdateCount((prev) => prev + 1)
      const timeout = setTimeout(() => setShowPulse(false), 1500)
      return () => clearTimeout(timeout)
    }
  }, [lastUpdated])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
    if (isConnected) return <Zap className="w-3 h-3 text-green-400" />
    return <WifiOff className="w-3 h-3 text-red-400" />
  }

  const getStatusText = () => {
    if (isLoading) return "Syncing..."
    if (isConnected) return "Live (3s)"
    return "Offline"
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${
          showPulse
            ? "bg-green-500/40 border border-green-400/80 shadow-lg shadow-green-500/30 scale-105"
            : isConnected
              ? "bg-green-500/15 border border-green-500/40"
              : "bg-red-500/15 border border-red-500/40"
        }`}
      >
        {getStatusIcon()}
        <span className={`font-medium ${isConnected ? "text-green-300" : "text-red-300"}`}>{getStatusText()}</span>
        {isConnected && updateCount > 0 && (
          <span className="text-green-400 text-xs bg-green-500/20 px-1 rounded">{updateCount}</span>
        )}
      </div>

      {lastUpdated && isConnected && (
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-green-400 font-mono text-xs">{lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      {connectionMethod && isConnected && (
        <span className="text-cyan-400 text-xs bg-cyan-500/10 px-2 py-0.5 rounded">{connectionMethod}</span>
      )}
    </div>
  )
}
