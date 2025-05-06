"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface TimeFilterProps {
  onFilterChange: (filter: string) => void
  currentFilter: string
}

export function TimeFilter({ onFilterChange, currentFilter }: TimeFilterProps) {
  const filters = [
    { label: "Last 24 hours", value: "24h" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
  ]

  const currentLabel = filters.find((f) => f.value === currentFilter)?.label || filters[0].label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filters.map((filter) => (
          <DropdownMenuItem key={filter.value} onClick={() => onFilterChange(filter.value)}>
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
