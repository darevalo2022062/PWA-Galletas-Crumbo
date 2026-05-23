'use client'
import BoxIllustration, { type BoxSize } from '@/components/illustrations/BoxIllustration'

interface Props {
  boxSize?: BoxSize
  boxColor?: string
  ribbonColor?: string
  label?: string
  interactive?: boolean
  open?: boolean
  animate?: boolean
}

export default function BoxScene({
  boxSize = 'x12',
  boxColor = '#E8596A',
  ribbonColor = '#D4A017',
  label,
  animate = true,
}: Props) {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <BoxIllustration
        boxSize={boxSize}
        boxColor={boxColor}
        ribbonColor={ribbonColor}
        label={label}
        animate={animate}
        size={260}
      />
    </div>
  )
}
