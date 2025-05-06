import { DashboardLayout } from "@/components/dashboard-layout"
import { GatewayCard } from "@/components/gateway-card"
import { gateways } from "@/lib/data"

export default function GatewaysPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <h1 className="text-2xl font-bold">IoT Gateways</h1>

        <div className="grid gap-4 md:grid-cols-3">
          {gateways.map((gateway) => (
            <GatewayCard key={gateway.id} gateway={gateway} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
