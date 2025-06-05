"use client"

import { useEffect, useRef } from "react"

export default function MinimalCyberpunkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Minimal grid settings
    const gridSize = 100
    let time = 0

    const draw = () => {
      // Clear canvas with dark background
      ctx.fillStyle = "#0a0a12"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw minimal static grid
      ctx.strokeStyle = "#1a1a2e"
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2

      // Vertical lines - static
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines - static
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Single subtle accent line that slowly moves
      ctx.globalAlpha = 0.4
      ctx.strokeStyle = "#00ffff"
      ctx.lineWidth = 1
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 5

      // One slow-moving horizontal line
      const lineY = ((time * 0.01) % (canvas.height * 2)) - canvas.height / 2
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(canvas.width, lineY)
      ctx.stroke()

      // Reset shadow
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      time += 8 // Slow animation
    }

    // Animation loop
    const interval = setInterval(draw, 32) // ~30fps

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Minimal corner accent */}
      <div className="absolute top-0 right-0 w-64 h-1 bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 w-64 h-1 bg-cyan-500/40" />
    </div>
  )
}
