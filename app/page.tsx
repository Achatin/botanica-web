"use client"

import { GardenGame } from "@/components/garden-game"
import { IntroScreen } from "@/components/intro-screen"
import { GameProvider } from "@/hooks/use-game-state"
import { useState } from "react"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  const handleStart = () => setShowIntro(false)

  return (
    <GameProvider>
      <div className="w-full h-screen">
        {showIntro && <IntroScreen onStart={handleStart} /> }
        <GardenGame />
      </div>
    </GameProvider>
  )
}
