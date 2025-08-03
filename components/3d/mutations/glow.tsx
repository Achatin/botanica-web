import { useEffect } from "react"
import * as THREE from "three"

type Props = {
  targetRef: React.RefObject<THREE.Object3D | null>
  color?: string
  emissiveIntensity?: number
}

export function GlowEffect({
  targetRef,
  color = "#00ff88",
  emissiveIntensity = 1,
}: Props) {
  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    // Traverse all meshes and add emissive material
    target.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const material = mesh.material as THREE.MeshStandardMaterial | THREE.MeshLambertMaterial

        // Clone to avoid affecting shared materials
        const cloned = material.clone()
        cloned.emissive = new THREE.Color(color)
        cloned.emissiveIntensity = emissiveIntensity

        mesh.material = cloned
      }
    })

    return () => {
      // Optional: clean up or reset emissive if needed
    }
  }, [targetRef, color, emissiveIntensity])

  return null
}
