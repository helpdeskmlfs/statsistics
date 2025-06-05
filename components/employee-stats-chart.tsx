"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { employeeData } from "@/lib/data"

export default function EmployeeStatsChart() {
  return (
    <ChartContainer
      config={{
        "Red Flag": {
          label: "Red Flag",
          color: "hsl(var(--chart-1))",
        },
        Onhold: {
          label: "Onhold",
          color: "hsl(var(--chart-2))",
        },
        "Assisted Ticket": {
          label: "Assisted Ticket",
          color: "hsl(var(--chart-3))",
        },
        Late: {
          label: "Late",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={employeeData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} interval={0} />
          <YAxis domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="Red Flag" fill="var(--color-Red Flag)" />
          <Bar dataKey="Onhold" fill="var(--color-Onhold)" />
          <Bar dataKey="Assisted Ticket" fill="var(--color-Assisted Ticket)" />
          <Bar dataKey="Late" fill="var(--color-Late)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
