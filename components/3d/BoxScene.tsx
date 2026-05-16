'use client'
import { useRef, Suspense, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

interface BoxMeshProps {
  color?: string
  ribbonColor?: string
  open?: boolean
}

function BoxMesh({ color = '#E8596A', ribbonColor = '#D4A017', open = false }: BoxMeshProps) {
  const lidRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3
    if (lidRef.current) {
      const targetY = open ? Math.PI / 2.5 : 0
      lidRef.current.rotation.x += (targetY - lidRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.8, 1.0, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh ref={lidRef} position={[0, 0.55, -0.9]}>
        <boxGeometry args={[1.85, 0.15, 1.85]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.85)} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.9, 0.08, 0.15]} />
        <meshStandardMaterial color={ribbonColor} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.15, 0.08, 1.9]} />
        <meshStandardMaterial color={ribbonColor} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color={ribbonColor} metalness={0.3} roughness={0.4} />
      </mesh>
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.3, 0.82, 0]} rotation={[0, 0, side * 0.5]}>
          <torusGeometry args={[0.18, 0.05, 8, 16, Math.PI]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

class ErrorBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

interface Props {
  color?: string
  ribbonColor?: string
  open?: boolean
  interactive?: boolean
}

export default function BoxScene({ color, ribbonColor, open = false, interactive = false }: Props) {
  const fallback = (
    <div className="w-full h-full flex items-center justify-center text-7xl">📦</div>
  )

  return (
    <div className={`w-full h-64 md:h-72 ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <ErrorBoundary fallback={fallback}>
        <Canvas
          shadows={false}
          camera={{ position: [0, 2, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'default', preserveDrawingBuffer: false }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, 0]} intensity={0.5} color="#D4A017" />
          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
              <BoxMesh color={color} ribbonColor={ribbonColor} open={open} />
            </Float>
            <Environment preset="sunset" />
          </Suspense>
          {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
