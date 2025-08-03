"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/hooks/use-game-state"
import { PLANT_TYPES } from "@/lib/game-data"
import type { Plant } from "@/lib/types"
import { calculatePlantValue } from "@/lib/utils"

interface PlantInfoPopupProps {
  plant: Plant | null
  open: boolean
  onClose: () => void
}

export function PlantInfoPopup({ plant, open, onClose }: PlantInfoPopupProps) {
  const { harvestPlant } = useGameState()

  if (!plant) return null

  const plantType = PLANT_TYPES[plant.type]

  const handleHarvest = () => {
    harvestPlant(plant.id)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: plantType.color }} />
            {plantType.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Growth:</span>
              <div className="font-medium">{Math.floor(plant.growthStage)}%</div>
            </div>
            <div>
              <span className="text-gray-500">Value:</span>
              <div className="font-medium text-green-600">{calculatePlantValue(plant)} coins</div>
            </div>
            <div>
              <span className="text-gray-500">Weight:</span>
              <div className="font-medium">
                {/* Weight growing with growthStage rounded to 2 decimal */}
                {Math.round(plant.weight * plant.growthStage / 100 * 100) / 100} kg
              </div>
            </div>
            <div>
              <span className="text-gray-500">Rarity:</span>
              <div className="font-medium capitalize">{plantType.rarity}</div>
            </div>
          </div>

          {/* Growth Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Growth Progress</span>
              <span>{Math.floor(plant.growthStage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${plant.growthStage}%` }}
              />
            </div>
          </div>

          {/* Mutations */}
          {plant.mutations.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-gray-500">Mutations:</span>
              <div className="flex flex-wrap gap-2">
                {plant.mutations.map((mutation) => (
                  <Badge
                    key={mutation.id}
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: mutation.color + "20", color: mutation.color }}
                  >
                    {mutation.name} ({mutation.valueMultiplier}x)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
            {plant.growthStage >= 100 && (
              <Button onClick={handleHarvest} className="flex-1 bg-green-600 hover:bg-green-700">
                Harvest ({calculatePlantValue(plant)} coins)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
