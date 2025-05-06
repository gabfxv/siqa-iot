import { Thermometer, Gauge, Droplets } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SensorCard } from "@/components/sensor-card"
import { SensorChart } from "@/components/sensor-chart"
import { getSensorsByType, getAverageReadingsByType } from "@/lib/data"

export default async function DashboardPage() {
  // Get sensors by type
  const temperatureSensors = getSensorsByType("temperature")
  const co2Sensors = getSensorsByType("co2")
  const humiditySensors = getSensorsByType("humidity")

  // Get average readings
  const avgTemperatureReadings = await getAverageReadingsByType("temperature")
  const avgCo2Readings = await getAverageReadingsByType("co2")
  const avgHumidityReadings = await getAverageReadingsByType("humidity")

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Temperature</h2>
            <SensorCard
              sensor={{
                id: "avg-temp",
                name: "Average Temperature",
                location: "All Sensors",
                type: "temperature",
                unit: "°C",
                gatewayId: "",
              }}
              reading={avgTemperatureReadings[avgTemperatureReadings.length - 1] || null}
              icon={<Thermometer className="h-5 w-5" />}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">CO2</h2>
            <SensorCard
              sensor={{
                id: "avg-co2",
                name: "Average CO2",
                location: "All Sensors",
                type: "co2",
                unit: "ppm",
                gatewayId: "",
              }}
              reading={avgCo2Readings[avgCo2Readings.length - 1] || null}
              icon={<Gauge className="h-5 w-5" />}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Humidity</h2>
            <SensorCard
              sensor={{
                id: "avg-humidity",
                name: "Average Humidity",
                location: "All Sensors",
                type: "humidity",
                unit: "%",
                gatewayId: "",
              }}
              reading={avgHumidityReadings[avgHumidityReadings.length - 1] || null}
              icon={<Droplets className="h-5 w-5" />}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <SensorChart
            title="Average Temperature"
            description="Average temperature across all sensors"
            data={avgTemperatureReadings}
            unit="°C"
            color="hsl(var(--chart-1))"
          />

          <SensorChart
            title="Average CO2"
            description="Average CO2 levels across all sensors"
            data={avgCo2Readings}
            unit="ppm"
            color="hsl(var(--chart-2))"
          />

          <SensorChart
            title="Average Humidity"
            description="Average humidity across all sensors"
            data={avgHumidityReadings}
            unit="%"
            color="hsl(var(--chart-3))"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
