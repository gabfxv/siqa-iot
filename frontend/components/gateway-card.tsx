import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Gateway } from "@/lib/data"
import { Battery, BatteryCharging, BatteryWarning } from "lucide-react"

interface GatewayCardProps {
  gateway: Gateway
}

export function GatewayCard({ gateway }: GatewayCardProps) {
  const getBatteryIcon = (level: number) => {
    if (level > 70) {
      return <BatteryCharging className="h-5 w-5 text-green-500" />
    } else if (level > 30) {
      return <Battery className="h-5 w-5 text-yellow-500" />
    } else {
      return <BatteryWarning className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{gateway.name}</CardTitle>
          <CardDescription>{gateway.location}</CardDescription>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs ${
            gateway.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {gateway.status}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {getBatteryIcon(gateway.batteryLevel)}
          <div className="text-2xl font-bold">{gateway.batteryLevel}%</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Last seen: {new Date(gateway.lastSeen).toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
