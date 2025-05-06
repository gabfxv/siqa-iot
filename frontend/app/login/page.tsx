"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Wind, Droplets, Gauge, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    // In a real implementation, this would redirect to your OAuth2 Google login endpoint
    // For demo purposes, we'll just redirect to the dashboard
    setTimeout(() => {
      router.replace("/api/login")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2">
        <Thermometer className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">IoT Sensor Dashboard</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your IoT sensor monitoring dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-lg border border-muted p-4">
                <Thermometer className="mb-2 h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-muted p-4">
                <Gauge className="mb-2 h-8 w-8 text-primary" />
                <span className="text-sm font-medium">CO2 Levels</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-muted p-4">
                <Droplets className="mb-2 h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-muted p-4">
                <Wind className="mb-2 h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Gateway Status</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-2" onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in with Google"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
