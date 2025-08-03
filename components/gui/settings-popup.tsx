"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX, Settings } from "lucide-react"
import { useAudio } from "@/context/audioContext"

export function SettingsPopup() {
  const [open, setOpen] = useState(false)

  const { volume: audioVolume, setVolume: setAudioVolume, muted: audioMuted, setMuted: setAudioMuted } = useAudio()

  const clearSaveData = () => {
    if (confirm("Are you sure you want to clear all save data? This cannot be undone.")) {
      localStorage.removeItem("garden-game-save")
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audio Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Audio Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAudioMuted(!audioMuted)}>
                    {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <span className="text-sm text-gray-600">{audioMuted ? "Muted" : "Unmuted"}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volume</span>
                    <span>{Math.round(audioVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioMuted ? 0 : audioVolume}
                    onChange={(e) => {
                      setAudioVolume(Number.parseFloat(e.target.value))
                      setAudioMuted(false)
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Game Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Game automatically saves every 5 seconds to local storage.</p>
                <Button variant="destructive" size="sm" onClick={clearSaveData} className="w-full">
                  Clear Save Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls Help */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Controls</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Click seeds in inventory to select</div>
                <div>• Click field tiles to plant selected seeds</div>
                <div>• Click grown plants to view info and harvest</div>
                <div>• Use mouse to rotate and zoom the camera</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
