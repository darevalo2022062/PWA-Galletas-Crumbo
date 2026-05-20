'use client'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

interface Props {
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const sizeMap = { sm: 'h-32', md: 'h-64', lg: 'h-72 md:h-80' }

export default function CookieScene({ size = 'lg' }: Props) {
  return (
    <div className={`w-full ${sizeMap[size]} relative`}>
      <Spline
        scene="https://prod.spline.design/uxkDe7IY2jhfRg-B/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
