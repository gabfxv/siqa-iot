"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeFilter } from "@/components/time-filter"
import type { SensorReading } from "@/lib/data"

interface SensorChartProps {
  title: string
  description?: string
  data: SensorReading[]
  unit: string
  color?: string
}

export function SensorChart({ title, description, data, unit, color = "hsl(var(--chart-1))" }: SensorChartProps) {
  const [timeFilter, setTimeFilter] = useState("24h")

  // Format the data for the chart
  const chartData = data.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: reading.value,
    fullTime: new Date(reading.timestamp).toLocaleString(),
  }))

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="ml-auto">
          <TimeFilter onFilterChange={setTimeFilter} currentFilter={timeFilter} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit={unit} />
              <Tooltip
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number) => [`${value} ${unit}`, "Value"]}
              />
              <Line type="monotone" dataKey="value" stroke={color} activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
