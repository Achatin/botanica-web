import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  targetRef: React.RefObject<THREE.Object3D | null>
  color?: string
  baseScale?: number // optional base scale multiplier for the shell size
  pulse?: boolean
}

export function ShellEffect({
  targetRef,
  color = "#00ffff",
  baseScale = 1.2,
  pulse = true,
}: Props) {
  const shellRef = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    const target = targetRef.current
    const shell = shellRef.current
    if (!target || !shell) return
  
    shell.position.copy(target.position)
    target.add(shell)
  
    return () => {
      target.remove(shell)
    }
  }, [targetRef])
  

  useFrame(({ clock }) => {
    if (shellRef.current && pulse && targetRef.current) {
      const t = clock.getElapsedTime()
      const scalePulse = baseScale + Math.sin(t * 2) * 0.05

      // Option 1: Uniform scaling (you can tweak if needed)
      shellRef.current.scale.set(scalePulse, scalePulse, scalePulse)
    }
  })

  return (
    <mesh ref={shellRef} position={[0, 0.5, 0]}>
      {/* Box with size 2 to give room to scale */}
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
