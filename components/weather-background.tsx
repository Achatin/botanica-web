"use client"

import { useGameState } from "@/hooks/use-game-state"

export function WeatherBackground() {
  const { weather } = useGameState()

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${weather ? weather.backgroundColor : "from-sky-200 to-green-100"} transition-all duration-1000 -z-10`} />
  )
}
