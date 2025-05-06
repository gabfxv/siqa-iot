import { Gauge } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SensorCard } from "@/components/sensor-card"
import { MultiSensorChart } from "@/components/multi-sensor-chart"
import { getSensorsByType, getLatestReadingForSensor, getReadingsForSensor, getAverageReadingsByType } from "@/lib/data"

export default async function CO2Page() {
  // Get CO2 sensors
  const co2Sensors = getSensorsByType("co2")

  // Get readings for each sensor
  const sensorReadings: Record<string, any> = {}
  for (const sensor of co2Sensors) {
    sensorReadings[sensor.id] = await getReadingsForSensor(sensor.id)
  }

  // Get average readings
  const avgCO2Readings = await getAverageReadingsByType("co2")

  return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          <h1 className="text-2xl font-bold">CO2 Sensors</h1>

          <div className="grid gap-4 md:grid-cols-3">
            {co2Sensors.map(async (sensor) => (
                <SensorCard
                    key={sensor.id}
                    sensor={sensor}
                    reading={await getLatestReadingForSensor(sensor.id)}
                    icon={<Gauge className="h-5 w-5"/>}
                />
            ))}
          </div>

          <MultiSensorChart
              title="CO2 Comparison"
              description="Compare CO2 readings across all sensors"
              sensors={co2Sensors}
              readings={sensorReadings}
              averageReadings={avgCO2Readings}
              unit="ppm"
          />
        </div>
      </DashboardLayout>
  )
}
