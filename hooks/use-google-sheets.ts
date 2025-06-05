"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { fetchGoogleSheetsData, extractSpreadsheetId, getSampleData, type EmployeeSheetData } from "@/lib/google-sheets"

export function useGoogleSheets(spreadsheetUrl: string) {
  const [data, setData] = useState<EmployeeSheetData[]>(getSampleData())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionMethod, setConnectionMethod] = useState<string>("")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataHashRef = useRef<string>("")
  const retryCountRef = useRef<number>(0)
  const isActiveRef = useRef<boolean>(true)
  const lastSuccessRef = useRef<Date | null>(null)

  const spreadsheetId = extractSpreadsheetId(spreadsheetUrl)

  // Create a detailed hash of the data to detect any changes
  const createDataHash = useCallback((data: EmployeeSheetData[]): string => {
    return JSON.stringify(
      data.map((emp) => ({
        id: emp.id,
        name: emp.name.trim(),
        department: emp.department.trim(),
        redFlag: emp["Red Flag"],
        onhold: emp.Onhold,
        assisted: emp["Assisted Ticket"],
        late: emp.Late,
      })),
    )
  }, [])

  const refreshData = useCallback(
    async (silent = false) => {
      if (!spreadsheetId || !isActiveRef.current) {
        if (!spreadsheetId) {
          setError("Invalid spreadsheet URL")
        }
        setLoading(false)
        return
      }

      if (!silent) {
        setLoading(true)
      }

      try {
        const result = await fetchGoogleSheetsData({
          spreadsheetId,
          sheetName: "Sheet1",
        })

        if (result.success && result.data.length > 0) {
          // Create hash of new data
          const newDataHash = createDataHash(result.data)

          // Check if data has actually changed
          if (newDataHash !== lastDataHashRef.current) {
            lastDataHashRef.current = newDataHash
            setData(result.data)
            setLastUpdated(new Date())
            setIsConnected(true)
            setConnectionMethod(result.method || "")
            setError(null)
            retryCountRef.current = 0
            lastSuccessRef.current = new Date()

            // Log successful update with details
            if (silent) {
              console.log(
                `🔄 Real-time update: ${result.data.length} employees loaded via ${result.method} at ${new Date().toLocaleTimeString()}`,
              )
            } else {
              console.log(`📊 Initial load: ${result.data.length} employees loaded via ${result.method}`)
            }
          } else {
            // Data hasn't changed, but we're still connected
            setIsConnected(true)
            setConnectionMethod(result.method || "")
            setError(null)
            retryCountRef.current = 0
          }
        } else {
          // Failed to fetch data
          setIsConnected(false)
          setConnectionMethod("")
          setError(result.error || "Failed to fetch data from Google Sheets")
          retryCountRef.current++

          // If we haven't had a successful connection in a while, show sample data
          if (retryCountRef.current > 3 && !lastSuccessRef.current) {
            setData(getSampleData())
          }
        }
      } catch (err) {
        console.error("Sheet fetch error:", err)
        setIsConnected(false)
        setConnectionMethod("")
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        retryCountRef.current++

        if (retryCountRef.current > 3 && !lastSuccessRef.current) {
          setData(getSampleData())
        }
      } finally {
        if (!silent) {
          setLoading(false)
        }
      }
    },
    [spreadsheetId, createDataHash],
  )

  // Start real-time polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Poll every 3 seconds for ultra-fast real-time updates
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        refreshData(true) // Silent refresh
      }
    }, 3000) // 3 seconds for ultra-fast updates
  }, [refreshData])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    isActiveRef.current = true

    // Initial data fetch
    refreshData()

    // Start polling after initial load
    const pollTimeout = setTimeout(() => {
      startPolling()
    }, 1000) // Start polling 1 second after initial load

    return () => {
      isActiveRef.current = false
      clearTimeout(pollTimeout)
      stopPolling()
    }
  }, [refreshData, startPolling, stopPolling])

  // Handle visibility and focus changes for optimal performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false
        stopPolling()
      } else {
        isActiveRef.current = true
        startPolling()
        // Immediate refresh when tab becomes active
        setTimeout(() => refreshData(true), 200)
      }
    }

    const handleFocus = () => {
      isActiveRef.current = true
      // Refresh immediately when window gains focus
      refreshData(true)
      startPolling()
    }

    const handleBlur = () => {
      isActiveRef.current = false
      stopPolling()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [refreshData, startPolling, stopPolling])

  return {
    data,
    loading,
    error,
    lastUpdated,
    isConnected,
    connectionMethod,
    refreshData: () => refreshData(false),
  }
}
