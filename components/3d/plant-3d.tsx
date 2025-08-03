"use client"

import { useRef, useState } from "react"
import { Box, Edges } from "@react-three/drei"
import { PLANT_TYPES } from "@/lib/game-data"
import type { Plant } from "@/lib/types"
import type * as THREE from "three"
import { GlowEffect } from "./mutations/glow"
import { ParticleEffect } from "./mutations/particles"
import { ShellEffect } from "./mutations/shell"

interface Plant3DProps {
  plant: Plant
  onPlantClick: (plant: Plant) => void
}

export function Plant3D({ plant, onPlantClick }: Plant3DProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null) // 👈 NEW
  const TILE_SIZE = 0.8
  const plantType = PLANT_TYPES[plant.type]


  const baseScale = plant.weight * (plant.growthStage / 100)

  // Calculate max size based on tile and plant type dimensions
  const maxTileWidth = plantType.size.width * TILE_SIZE
  const maxTileHeight = plantType.size.height * TILE_SIZE
  const tileLimit = Math.min(maxTileWidth, maxTileHeight)

  // Allow 10% overflow if weight > plantType.maxWeight
  const isHuge = plant.weight > plantType.maxWeight
  const scaleCap = tileLimit * (isHuge ? 1.1 : 1)

  const growthScale = Math.min(baseScale, scaleCap)


  // useFrame((state) => {
  //   if (groupRef.current) {
  //     const s = growthScale + Math.sin(state.clock.elapsedTime * 2) * 0.05
  //     groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  //     groupRef.current.scale.setScalar(s)
  //   }
  // })

  const handleClick = () => {
    onPlantClick(plant)
  }

  return (
    <group
      position={[
        plant.x * TILE_SIZE + ((plantType.size.width - 1) * TILE_SIZE) / 2,
        0,
        plant.y * TILE_SIZE + ((plantType.size.height - 1) * TILE_SIZE) / 2,
      ]}
    >
      {/* Animated plant and outline together */}
      <group ref={groupRef}>
        {/* Plant mesh */}
        <Box
          args={[
            plantType.size.width * TILE_SIZE * 0.8,
            0.5 + growthScale * 0.5,
            plantType.size.height * TILE_SIZE * 0.8,
          ]}
          position={[0, (0.5 + growthScale * 0.5) / 2, 0]}
          onClick={handleClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshLambertMaterial
            color={plantType.color}
            opacity={1}
          />
        </Box>

        {/* Hover outline (moves + scales with plant) */}
        {hovered && (
          <Box
            args={[
              plantType.size.width * TILE_SIZE * 0.8,
              0.5 + growthScale * 0.5,
              plantType.size.height * TILE_SIZE * 0.8,
            ]}
            position={[0, (0.5 + growthScale * 0.5) / 2, 0]}
          >
            <meshBasicMaterial color={plantType.color} transparent opacity={0} />
            <Edges scale={1.02} threshold={15} color="#00ffcc" />
            <Edges scale={1.025} threshold={15} color="#00ffcc" />
            <Edges scale={1.03} threshold={15} color="#00ffcc" />
          </Box>
        )}

        {/* Mutation effects */}
        {plant.mutations.map((mutation, index) => {
          if (mutation.id === "golden") {
            return <GlowEffect key={index} targetRef={groupRef} color="#FFD700" />
          }
          else if (mutation.id === "rainbow") {
            return <ShellEffect key={index} targetRef={groupRef} color="#FB5581" />
          }
          else if (mutation.id === "moonlit") {
            return <GlowEffect key={index} targetRef={groupRef} color="#590098" />
          }
          else if (mutation.id === "sundried") {
            return <ParticleEffect key={index} targetRef={groupRef} color="#a8a7a7" count={10} size={0.1} radius={0.5} />
          }
          else if (mutation.id === "soaked") {
            return <ParticleEffect key={index} targetRef={groupRef} color="#5cb5e1" count={10} size={0.1} radius={0.5} />
          }
          else if (mutation.id === "charged") {
            return <ShellEffect key={index} targetRef={groupRef} color="#ffff00" />
          }
          else return null
        })}
      </group>


      {/* Progress bar */}
      {plant.growthStage < 100 && (
        <>
          <Box args={[plantType.size.width * TILE_SIZE * 0.9, 0.05, 0.1]} position={[0, 1.2, 0]}>
            <meshBasicMaterial color="lightgray" />
          </Box>
          <Box
            args={[
              plantType.size.width * TILE_SIZE * 0.9 * plant.growthStage / 100 + 0.001,
              0.05 + 0.001,
              0.1 + 0.001
            ]}
            position={[
              -((plantType.size.width * TILE_SIZE * 0.9 * (1 - plant.growthStage / 100)) / 2),
              1.2,
              0
            ]}
          >
            <meshBasicMaterial color="#4caf50" />
          </Box>
        </>
      )}
    </group>
  )
}
