import { useEffect, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  targetRef: React.RefObject<THREE.Object3D | null>
  count?: number
  color?: string
  radius?: number
  size?: number
}

export function ParticleEffect({
  targetRef,
  count = 100,
  color = "#00ffff",
  radius = 1.5,
  size = 0.05,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const baseAngles = new Float32Array(count)
    const speeds = new Float32Array(count)
    const radii = new Float32Array(count)
    const verticalOffsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI
      const r = radius * (0.8 + Math.random() * 0.4)
      const y = (Math.random() - 0.5) * radius * 0.6

      const x = r * Math.cos(theta)
      const z = r * Math.sin(theta)

      positions.set([x, y, z], i * 3)
      baseAngles[i] = theta
      speeds[i] = 0.2 + Math.random() * 0.3
      radii[i] = r
      verticalOffsets[i] = y
    }

    return { positions, baseAngles, speeds, radii, verticalOffsets }
  }, [count, radius])

  useEffect(() => {
    const target = targetRef.current
    const points = pointsRef.current
    if (!target || !points) return
  
    target.add(points)
  
    return () => {
      target.remove(points)
    }
  }, [targetRef])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const { baseAngles, speeds, radii, verticalOffsets } = particles
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      const angle = baseAngles[i] + speeds[i] * t
      const r = radii[i]
      const y = verticalOffsets[i] + Math.sin(t * 1.5 + i) * 0.1

      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)

      positionAttr.array[i * 3] = x
      positionAttr.array[i * 3 + 1] = y
      positionAttr.array[i * 3 + 2] = z
    }

    positionAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={[0, 0.5, 0]}>
      <bufferGeometry ref={(geom) => {
        if (!geom) return
        geom.setAttribute(
          "position",
          new THREE.BufferAttribute(particles.positions, 3)
        )
      }} />
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
