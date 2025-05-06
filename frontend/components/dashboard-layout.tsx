"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Thermometer, Wind, Droplets, Gauge, LayoutDashboard, Menu, LogOut } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/temperature",
      label: "Temperature",
      icon: <Thermometer className="h-5 w-5" />,
      active: pathname === "/dashboard/temperature",
    },
    {
      href: "/dashboard/co2",
      label: "CO2",
      icon: <Gauge className="h-5 w-5" />,
      active: pathname === "/dashboard/co2",
    },
    {
      href: "/dashboard/humidity",
      label: "Humidity",
      icon: <Droplets className="h-5 w-5" />,
      active: pathname === "/dashboard/humidity",
    },
    {
      href: "/dashboard/gateways",
      label: "Gateways",
      icon: <Wind className="h-5 w-5" />,
      active: pathname === "/dashboard/gateways",
    },
  ]

  const handleSignOut = async () => {
    window.location.href = "/api/logout"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                <Thermometer className="h-6 w-6" />
                <span>IoT Dashboard</span>
              </Link>
              <div className="grid gap-3">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                      route.active ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.icon}
                    <span>{route.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-auto">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Thermometer className="h-6 w-6" />
          <span className="hidden md:inline">IoT Sensor Dashboard</span>
        </Link>
        <nav className="hidden sm:flex flex-1 items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-2 ${
                route.active ? "font-medium text-primary" : "text-muted-foreground"
              }`}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  )
}
