"use client"

import { Box } from "@react-three/drei"
import { PLANT_TYPES } from "@/lib/game-data"

interface PlantPreviewProps {
  plantType: string
  x: number
  y: number
  canPlace: boolean
}

export function PlantPreview({ plantType, x, y, canPlace }: PlantPreviewProps) {
  const plant = PLANT_TYPES[plantType]
  const TILE_SIZE = 0.8

  return (
    <Box
      args={[plant.size.width * TILE_SIZE * 0.8, 0.5, plant.size.height * TILE_SIZE * 0.8]}
      position={[
        x * TILE_SIZE + ((plant.size.width - 1) * TILE_SIZE) / 2,
        0.25,
        y * TILE_SIZE + ((plant.size.height - 1) * TILE_SIZE) / 2,
      ]}
    >
      <meshLambertMaterial color={canPlace ? plant.color : "#f44336"} transparent opacity={0.5} />
    </Box>
  )
}
