"use client"

import EmployeeStatsChart from "@/components/employee-stats-chart"
import { EmployeeTable } from "@/components/employee-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { employeeData } from "@/lib/data"

export default function Home() {
  // Calculate totals from the actual data
  const totalEmployees = employeeData.length
  const totalRedFlag = employeeData.reduce((sum, emp) => sum + emp["Red Flag"], 0)
  const totalOnhold = employeeData.reduce((sum, emp) => sum + emp.Onhold, 0)
  const totalAssistedTickets = employeeData.reduce((sum, emp) => sum + emp["Assisted Ticket"], 0)

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <h1 className="text-xl font-semibold">Helpdesk Agent Statistics Dashboard</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Helpdesk Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Active employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Red Flag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRedFlag}</div>
                <p className="text-xs text-muted-foreground">Total score</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Onhold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOnhold}</div>
                <p className="text-xs text-muted-foreground">Total score</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assisted Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssistedTickets}</div>
                <p className="text-xs text-muted-foreground">Total tickets</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="chart">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Statistics</CardTitle>
                  <CardDescription>
                    View metrics for red flags, onhold tickets, and assisted tickets for all employees
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <EmployeeStatsChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="table" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Data</CardTitle>
                  <CardDescription>Detailed view of all employee statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeeTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
