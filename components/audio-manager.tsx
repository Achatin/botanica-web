"use client"

import { useAudio } from "@/context/audioContext"
import { useEffect, useRef } from "react"

export function AudioManager() {
  const { volume, muted } = useAudio()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio("/audio/morning-mood.mp3")
    audio.loop = true
    audio.volume = muted ? 0 : volume
    audioRef.current = audio

    const playAudio = () => {
      audio.play().catch(console.log)
      document.removeEventListener("click", playAudio)
    }

    document.addEventListener("click", playAudio)

    return () => {
      audio.pause()
      document.removeEventListener("click", playAudio)
    }
  }, [muted, volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  return null
}
