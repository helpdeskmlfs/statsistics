"use client"

import { useState, useEffect } from "react"
import EmployeeStatsChart from "@/components/employee-stats-chart"
import EmployeeTable from "@/components/employee-table"
import EmployeeManagement from "@/components/employee-management"
import RealTimeIndicator from "@/components/real-time-indicator"
import SheetSetupGuide from "@/components/sheet-setup-guide"
import SheetsIntegrationGuide from "@/components/sheets-integration-guide"
import MinimalCyberpunkBackground from "@/components/minimal-cyberpunk-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Settings } from "lucide-react"
import { useGoogleSheets } from "@/hooks/use-google-sheets"
import { extractSpreadsheetId } from "@/lib/google-sheets"

// Your Google Sheets URL
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1AJoBk_odFcqrY8SMTuiEWf9Q5KcNzcAUyNxgDVelRBg/edit?usp=sharing"
const SPREADSHEET_ID = extractSpreadsheetId(SPREADSHEET_URL)

export default function Home() {
  const {
    data: sheetData,
    loading,
    error,
    lastUpdated,
    isConnected,
    connectionMethod,
    refreshData,
  } = useGoogleSheets(SPREADSHEET_URL)

  const [employeeData, setEmployeeData] = useState(sheetData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  // Update local data when sheet data changes with smooth transitions
  useEffect(() => {
    if (sheetData.length > 0) {
      setEmployeeData(sheetData)
    }
  }, [sheetData])

  const handleDataChange = (newData: typeof employeeData) => {
    setEmployeeData(newData)
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <MinimalCyberpunkBackground />
      <div className="flex flex-col relative z-10">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-cyan-500/20 bg-black/40 backdrop-blur-md px-4 md:px-6">
          <h1 className="text-xl font-semibold text-cyan-50">Helpdesk Agent Statistics Dashboard</h1>
          <div className="ml-auto flex items-center gap-3">
            <RealTimeIndicator
              isConnected={isConnected}
              lastUpdated={lastUpdated}
              isLoading={loading}
              connectionMethod={connectionMethod}
            />
            <Button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={() => window.open(SPREADSHEET_URL, "_blank")}
              size="sm"
              variant="outline"
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open Sheet
            </Button>
            <Button
              onClick={() => setShowSetup(!showSetup)}
              size="sm"
              variant="outline"
              className={`border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 ${showSetup ? "bg-cyan-500/20" : ""}`}
            >
              <Settings className="w-3 h-3 mr-1" />
              Setup
            </Button>
            <EmployeeManagement onDataChange={handleDataChange} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {/* Show setup guides */}
          {!isConnected && <SheetSetupGuide isConnected={isConnected} error={error} />}
          {showSetup && <SheetsIntegrationGuide spreadsheetId={SPREADSHEET_ID} spreadsheetUrl={SPREADSHEET_URL} />}

          {/* Statistics Cards with Real-time Updates */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-500 hover:shadow-cyan-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-50">Total Helpdesk Agent</CardTitle>
                {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white transition-all duration-700 transform">
                  {employeeData.length}
                </div>
                <p className="text-xs text-cyan-200">Active employees</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-md border-red-500/20 shadow-lg shadow-red-500/5 transition-all duration-500 hover:shadow-red-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-50">Total Red Flag</CardTitle>
                {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white transition-all duration-700 transform">
                  {employeeData.length > 0 ? employeeData.reduce((sum, emp) => sum + emp["Red Flag"], 0) : 0}
                </div>
                <p className="text-xs text-red-200">Total score</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-md border-yellow-500/20 shadow-lg shadow-yellow-500/5 transition-all duration-500 hover:shadow-yellow-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-50">Total Onhold</CardTitle>
                {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white transition-all duration-700 transform">
                  {employeeData.length > 0 ? employeeData.reduce((sum, emp) => sum + emp.Onhold, 0) : 0}
                </div>
                <p className="text-xs text-yellow-200">Total score</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-md border-blue-500/20 shadow-lg shadow-blue-500/5 transition-all duration-500 hover:shadow-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-50">Late</CardTitle>
                {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white transition-all duration-700 transform">
                  {employeeData.length > 0 ? employeeData.reduce((sum, emp) => sum + emp.Late, 0) : 0}
                </div>
                <p className="text-xs text-blue-200">Total score</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Table Views with Real-time Connection */}
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="bg-black/40 backdrop-blur-md border border-cyan-500/20">
              <TabsTrigger
                value="chart"
                className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-50"
              >
                Chart View
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-50"
              >
                Table View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-4">
              <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/5 w-full transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-cyan-50 flex items-center gap-2">
                    Employee Statistics Chart
                    {isConnected && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Real-time Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-cyan-200">
                    Live chart updates automatically when you edit the Google Sheet
                    {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="w-full overflow-x-auto">
                    <EmployeeStatsChart data={employeeData} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <Card className="bg-black/40 backdrop-blur-md border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-cyan-50 flex items-center gap-2">
                    Employee Data Table
                    {isConnected && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Real-time Connected
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-cyan-200">
                    Live table updates automatically when you edit the Google Sheet
                    {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeeTable data={employeeData} onDataChange={handleDataChange} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
