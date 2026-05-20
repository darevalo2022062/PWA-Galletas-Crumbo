'use client'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

interface Props {
  interactive?: boolean
  open?: boolean
}

export default function BoxScene({}: Props) {
  return (
    <div className="w-full h-64 md:h-72 relative">
      <Spline
        scene="https://prod.spline.design/qsPQQX687EDbWJu2/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
