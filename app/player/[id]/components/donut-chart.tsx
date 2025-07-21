"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DonutChartProps {
  percentage: number
  rank: number
  label: string
  value: number
  size?: number
  thickness?: number
  className?: string
  teamColors: {
    primary: string
    secondary: string
  }
}

export function DonutChart({
  percentage,
  rank, 
  label,
  value,
  size = 200,
  thickness = 12,
  className,
  teamColors,
}: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr

    // Scale all drawing operations by dpr
    ctx.scale(dpr, dpr)

    // Set canvas size via styles
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const centerX = size / 2
    const centerY = size / 2
    const radius = (size - thickness) / 2

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw a subtle circular outline to define the donut shape
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(226, 232, 240, 0.3)" // Very subtle outline
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw background circle (track) - now very subtle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(226, 232, 240, 0.08)"
    ctx.lineWidth = thickness
    ctx.stroke()

    // Draw percentage arc
    const startAngle = -Math.PI / 2 // Start from top
    const endAngle = startAngle + (normalizedPercentage / 100) * Math.PI * 2

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = `${teamColors.primary}BF`
    ctx.lineWidth = thickness
    ctx.stroke()

    // Draw tick marks that align with the donut's thickness
    // Major ticks at 1% intervals
    const majorTickCount = 100 // 1% increments
    for (let i = 0; i <= majorTickCount; i++) {
      const angle = -Math.PI / 2 + (i / majorTickCount) * Math.PI * 2

      // Calculate tick positions to align with the donut's thickness
      const outerTickRadius = radius + thickness / 2 // Align with outer edge of donut
      const innerTickRadius = radius - thickness / 2 // Align with inner edge of donut

      // Draw tick marks that span exactly the width of the donut
      ctx.beginPath()
      ctx.moveTo(centerX + innerTickRadius * Math.cos(angle), centerY + innerTickRadius * Math.sin(angle))
      ctx.lineTo(centerX + outerTickRadius * Math.cos(angle), centerY + outerTickRadius * Math.sin(angle))
      ctx.strokeStyle = "rgba(203, 213, 225, 0.5)" // Subtle but visible
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw minor ticks at 5% intervals (between major ticks)
    for (let i = 0; i < majorTickCount * 2; i++) {
      // Skip positions where major ticks are already drawn
      if (i % 2 === 0) continue

      const angle = -Math.PI / 2 + (i / (majorTickCount * 2)) * Math.PI * 2

      // Minor ticks are shorter, only extending partially through the donut thickness
      const outerTickRadius = radius + thickness / 4 // Start from 1/4 into the donut
      const innerTickRadius = radius - thickness / 4 // End at 1/4 from inner edge

      ctx.beginPath()
      ctx.moveTo(centerX + innerTickRadius * Math.cos(angle), centerY + innerTickRadius * Math.sin(angle))
      ctx.lineTo(centerX + outerTickRadius * Math.cos(angle), centerY + outerTickRadius * Math.sin(angle))
      ctx.strokeStyle = "rgba(203, 213, 225, 0.3)" // More subtle for minor ticks
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // Draw overlay tick marks on the filled section for better visibility
    for (let i = 0; i <= majorTickCount; i++) {
      const angle = -Math.PI / 2 + (i / majorTickCount) * Math.PI * 2

      // Only draw overlay ticks within the filled area
      if (angle <= endAngle) {
        const outerTickRadius = radius + thickness / 2
        const innerTickRadius = radius - thickness / 2

        ctx.beginPath()
        ctx.moveTo(centerX + innerTickRadius * Math.cos(angle), centerY + innerTickRadius * Math.sin(angle))
        ctx.lineTo(centerX + outerTickRadius * Math.cos(angle), centerY + outerTickRadius * Math.sin(angle))
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)" // White overlay ticks
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }, [normalizedPercentage, size, thickness, teamColors])

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative">
        <canvas ref={canvasRef} width={size} height={size} className="rounded-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Badge
            className={cn("mb-2 px-3 py-1 text-xs font-bold uppercase tracking-wider")}
            style={{
              backgroundColor: teamColors.primary,
              color: "white"
            }}
          >
            {rank}
            {getOrdinalSuffix(rank)}
          </Badge>
          {isClient && (
            <span className="text-4xl font-bold" style={{ color: teamColors.primary, }}>
              {value}
            </span>
          )}
        </div>
      </div>
      <span className="mt-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  )
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) {
    return "st"
  }
  if (j === 2 && k !== 12) {
    return "nd"
  }
  if (j === 3 && k !== 13) {
    return "rd"
  }
  return "th"
}

