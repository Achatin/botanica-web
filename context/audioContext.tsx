// context/AudioContext.tsx
"use client"

import { createContext, useContext, useState } from "react"

type AudioContextType = {
  volume: number
  muted: boolean
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)

  return (
    <AudioContext.Provider value={{ volume, muted, setVolume, setMuted }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error("useAudio must be used within AudioProvider")
  return context
}
