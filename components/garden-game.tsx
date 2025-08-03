"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Field3D } from "@/components/3d/field-3d"
import { Sidebar } from "@/components/gui/sidebar-game"
import { WeatherBackground } from "@/components/weather-background"
import { AudioManager } from "@/components/audio-manager"
import { PlantInfoPopup } from "@/components/gui/plant-info-popup"
import type { Plant } from "@/lib/types"
import { AudioProvider } from "@/context/audioContext"
import { Bloom, EffectComposer } from "@react-three/postprocessing"

export function GardenGame() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [showPlantPopup, setShowPlantPopup] = useState(false)

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant)
    setShowPlantPopup(true)
  }

  const handleClosePopup = () => {
    setShowPlantPopup(false)
    setSelectedPlant(null)
  }

  return (
    <AudioProvider>
      <div className="flex h-screen">
        <WeatherBackground />
        <AudioManager />

        {/* 3D Game Area */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [5.1, 2, 6], fov: 60 }} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
              <Environment preset="park" />
              <Field3D onPlantClick={handlePlantClick} />
              <OrbitControls
                target={[5.1, 0, 1.2]}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={5}
                maxDistance={15}
              />

              {/* 🌟 Bloom effect */}
              <EffectComposer>
                <Bloom
                  intensity={1.5} // how strong the glow is
                  luminanceThreshold={0.2} // which pixels start glowing
                  luminanceSmoothing={0.9}
                />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>

        {/* Game Sidebar */}
        <Sidebar />

        {/* Plant Info Popup - Rendered outside Canvas */}
        <PlantInfoPopup plant={selectedPlant} open={showPlantPopup} onClose={handleClosePopup} />
      </div>
    </AudioProvider>
  )
}
