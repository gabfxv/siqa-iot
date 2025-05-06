import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Sensor, SensorReading } from "@/lib/data"

interface SensorCardProps {
  sensor: Sensor
  reading: SensorReading | null
  icon: React.ReactNode
}

export function SensorCard({ sensor, reading, icon }: SensorCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{sensor.name}</CardTitle>
          <CardDescription>{sensor.location}</CardDescription>
        </div>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{reading ? `${reading.value} ${sensor.unit}` : "No data"}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {reading ? `Last updated: ${new Date(reading.timestamp).toLocaleTimeString()}` : ""}
        </p>
      </CardContent>
    </Card>
  )
}
