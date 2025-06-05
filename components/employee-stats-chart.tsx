"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Employee {
  id: number
  name: string
  department: string
  "Red Flag": number
  Onhold: number
  "Assisted Ticket": number
  Late: number
}

interface EmployeeStatsChartProps {
  data?: Employee[]
}

export default function EmployeeStatsChart({ data }: EmployeeStatsChartProps) {
  return (
    <ChartContainer
      config={{
        "Red Flag": {
          label: "Red Flag",
          color: "#dc2626",
        },
        Onhold: {
          label: "Onhold",
          color: "#eab308",
        },
        "Assisted Ticket": {
          label: "Assisted Ticket",
          color: "#00ff00",
        },
        Late: {
          label: "Late",
          color: "#2563eb",
        },
      }}
      className="h-[500px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 80 }} barCategoryGap="10%">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} interval={0} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
          <Bar dataKey="Red Flag" fill="#dc2626" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Onhold" fill="#eab308" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Assisted Ticket" fill="#00ff00" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Late" fill="#2563eb" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
