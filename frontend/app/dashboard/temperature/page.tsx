import { Thermometer } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SensorCard } from "@/components/sensor-card"
import { MultiSensorChart } from "@/components/multi-sensor-chart"
import { getSensorsByType, getLatestReadingForSensor, getReadingsForSensor, getAverageReadingsByType } from "@/lib/data"

export default async function TemperaturePage() {
  const temperatureSensors = getSensorsByType("temperature")
  console.log(temperatureSensors)

  const sensorReadings: Record<string, any> = {}
  for (const sensor of temperatureSensors) {
    sensorReadings[sensor.id] = await getReadingsForSensor(sensor.id)
    console.log(sensorReadings[sensor.id])
  }

  const avgTemperatureReadings = await getAverageReadingsByType("temperature")
  console.log(avgTemperatureReadings)

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <h1 className="text-2xl font-bold">Temperature Sensors</h1>

        <div className="grid gap-4 md:grid-cols-3">
          {temperatureSensors.map(async (sensor) => (
              <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  reading={await getLatestReadingForSensor(sensor.id)}
                  icon={<Thermometer className="h-5 w-5"/>}
              />
          ))}
        </div>

        <MultiSensorChart
          title="Temperature Comparison"
          description="Compare temperature readings across all sensors"
          sensors={temperatureSensors}
          readings={sensorReadings}
          averageReadings={avgTemperatureReadings}
          unit="°C"
        />
      </div>
    </DashboardLayout>
  )
}
