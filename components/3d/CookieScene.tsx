'use client'
import { useRef, Suspense, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

interface CookieMeshProps {
  color?: string
  toppingColor?: string
  hasChips?: boolean
}

function CookieMesh({ color = '#C8852A', toppingColor = '#5C3317', hasChips = true }: CookieMeshProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.15, 0.22, 32]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.17, 0.07, 16, 64]} />
        <meshStandardMaterial color={toppingColor} roughness={0.9} />
      </mesh>
      {hasChips && Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 0.55 + (i % 3) * 0.2
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.12, Math.sin(angle) * r]} rotation={[Math.PI / 2, 0, angle]}>
            <cylinderGeometry args={[0.1, 0.1, 0.07, 6]} />
            <meshStandardMaterial color="#3B1A08" roughness={0.6} />
          </mesh>
        )
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={`crack-${i}`} position={[Math.cos(angle) * 0.3, 0.12, Math.sin(angle) * 0.3]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={toppingColor} roughness={1} />
          </mesh>
        )
      })}
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
  cookieColor?: string
  toppingColor?: string
  hasChips?: boolean
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-32', md: 'h-64', lg: 'h-72 md:h-80' }

export default function CookieScene({
  cookieColor,
  toppingColor,
  hasChips = true,
  interactive = false,
  size = 'lg',
}: Props) {
  const fallback = (
    <div className="w-full h-full flex items-center justify-center text-7xl">🍪</div>
  )

  return (
    <div className={`w-full ${sizeMap[size]} ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <ErrorBoundary fallback={fallback}>
        <Canvas
          shadows={false}
          camera={{ position: [0, 2, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'default', preserveDrawingBuffer: false }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, 0]} intensity={0.4} color="#D4A017" />
          <Suspense fallback={null}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
              <CookieMesh color={cookieColor} toppingColor={toppingColor} hasChips={hasChips} />
            </Float>
            <Environment preset="sunset" />
          </Suspense>
          {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
