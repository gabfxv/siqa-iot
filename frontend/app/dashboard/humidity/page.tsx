import { Droplets } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SensorCard } from "@/components/sensor-card"
import { MultiSensorChart } from "@/components/multi-sensor-chart"
import { getSensorsByType, getLatestReadingForSensor, getReadingsForSensor, getAverageReadingsByType } from "@/lib/data"

export default async function HumidityPage() {
  // Get humidity sensors
  const humiditySensors = getSensorsByType("humidity")

  // Get readings for each sensor
  const sensorReadings: Record<string, any> = {}
  for (const sensor of humiditySensors) {
    sensorReadings[sensor.id] = await getReadingsForSensor(sensor.id)
  }

  // Get average readings
  const avgHumidityReadings = await getAverageReadingsByType("humidity")

  return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          <h1 className="text-2xl font-bold">Humidity Sensors</h1>

          <div className="grid gap-4 md:grid-cols-3">
            {humiditySensors.map(async (sensor) => (
                <SensorCard
                    key={sensor.id}
                    sensor={sensor}
                    reading={await getLatestReadingForSensor(sensor.id)}
                    icon={<Droplets className="h-5 w-5"/>}
                />
            ))}
          </div>

          <MultiSensorChart
              title="Humidity Comparison"
              description="Compare humidity readings across all sensors"
              sensors={humiditySensors}
              readings={sensorReadings}
              averageReadings={avgHumidityReadings}
              unit="%"
          />
        </div>
      </DashboardLayout>
  )
}
