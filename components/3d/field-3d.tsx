"use client"

import { useRef, useState } from "react"
import { Plane, Box } from "@react-three/drei"
import { useGameState } from "@/hooks/use-game-state"
import { Plant3D } from "./plant-3d"
import { PlantPreview } from "./plant-preview"
import { PLANT_TYPES } from "@/lib/game-data"
import type { Plant } from "@/lib/types"
import type * as THREE from "three"

interface Field3DProps {
  onPlantClick: (plant: Plant) => void
}

export function Field3D({ onPlantClick }: Field3DProps) {
  const { plants, plantSeed, draggedPlant, setDraggedPlant } = useGameState()
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)
  const fieldRef = useRef<THREE.Group>(null)

  const FIELD_WIDTH = 4
  const FIELD_HEIGHT = 3
  const TILE_SIZE = 0.8

  const handleTileClick = (x: number, y: number) => {
    if (draggedPlant) {
      const plantType = PLANT_TYPES[draggedPlant]

      // Check if plant fits
      if (canPlacePlant(x, y, plantType.size.width, plantType.size.height)) {
        plantSeed(draggedPlant, x, y)
        setDraggedPlant(null)
      }
    }
  }

  const canPlacePlant = (x: number, y: number, width: number, height: number) => {
    // Check bounds
    if (x + width > FIELD_WIDTH || y + height > FIELD_HEIGHT) return false

    // Check for existing plants
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        if (
          plants.some((plant) => {
            const plantType = PLANT_TYPES[plant.type]
            return (
              plant.x <= x + dx &&
              plant.x + plantType.size.width > x + dx &&
              plant.y <= y + dy &&
              plant.y + plantType.size.height > y + dy
            )
          })
        ) {
          return false
        }
      }
    }
    return true
  }

  return (
    <group ref={fieldRef} position={[3.5, 0, 0]}>
      {/* Ground plane */}
      <Plane
        args={[FIELD_WIDTH * TILE_SIZE, FIELD_HEIGHT * TILE_SIZE]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[((FIELD_WIDTH - 1) * TILE_SIZE) / 2, 0, ((FIELD_HEIGHT - 1) * TILE_SIZE) / 2]}
      >
        <meshLambertMaterial color="#8bc34a" />
      </Plane>

      {/* Tiles */}
      {Array.from({ length: FIELD_WIDTH }, (_, x) =>
        Array.from({ length: FIELD_HEIGHT }, (_, y) => (
          <Box
            key={`${x}-${y}`}
            args={[TILE_SIZE * 0.95, 0.05, TILE_SIZE * 0.95]}
            position={[x * TILE_SIZE, 0.025, y * TILE_SIZE]}
            onClick={() => handleTileClick(x, y)}
            onPointerEnter={() => setHoveredTile({ x, y })}
            onPointerLeave={() => setHoveredTile(null)}
          >
            <meshLambertMaterial
              color={hoveredTile?.x === x && hoveredTile?.y === y ? "#4caf50" : "#66bb6a"}
              transparent
              opacity={0.8}
            />
          </Box>
        )),
      )}

      {/* Plants */}
      {plants.map((plant) => (
        <Plant3D key={plant.id} plant={plant} onPlantClick={onPlantClick} />
      ))}

      {/* Plant preview when dragging */}
      {draggedPlant && hoveredTile && (
        <PlantPreview
          plantType={draggedPlant}
          x={hoveredTile.x}
          y={hoveredTile.y}
          canPlace={canPlacePlant(
            hoveredTile.x,
            hoveredTile.y,
            PLANT_TYPES[draggedPlant].size.width,
            PLANT_TYPES[draggedPlant].size.height,
          )}
        />
      )}
    </group>
  )
}
