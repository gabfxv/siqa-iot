"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeFilter } from "@/components/time-filter"
import type { Sensor, SensorReading } from "@/lib/data"

interface MultiSensorChartProps {
  title: string
  description?: string
  sensors: Sensor[]
  readings: Record<string, SensorReading[]>
  averageReadings: SensorReading[]
  unit: string
}

export function MultiSensorChart({
  title,
  description,
  sensors,
  readings,
  averageReadings,
  unit,
}: MultiSensorChartProps) {
  const [timeFilter, setTimeFilter] = useState("24h")

  // Format the data for the chart
  const chartData = averageReadings.map((avgReading) => {
    const result: Record<string, any> = {
      time: new Date(avgReading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      average: avgReading.value,
      fullTime: new Date(avgReading.timestamp).toLocaleString(),
    }

    // Add individual sensor readings
    sensors.forEach((sensor) => {
      const sensorReadings = readings[sensor.id] || []
      const matchingReading = sensorReadings.find((r) => r.timestamp === avgReading.timestamp)
      if (matchingReading) {
        result[sensor.name] = matchingReading.value
      }
    })

    return result
  })

  // Define colors for each line
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

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
                formatter={(value: number, name: string) => [`${value} ${unit}`, name]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                name="Average"
                stroke="#ff7300"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              {sensors.map((sensor, index) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.name}
                  stroke={colors[index % colors.length]}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
