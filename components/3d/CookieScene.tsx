'use client'
import CookieIllustration from '@/components/illustrations/CookieIllustration'

interface Props {
  cookieColor?: string
  toppingColor?: string
  chipColor?: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  animate?: boolean
}

const sizeMap = { sm: 120, md: 200, lg: 260 }

export default function CookieScene({
  cookieColor = '#C8852A',
  toppingColor,
  chipColor = '#3B1A08',
  size = 'lg',
  animate = true,
}: Props) {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <CookieIllustration
        baseColor={cookieColor}
        frostingColor={toppingColor ?? '#F5CBA7'}
        chipColor={chipColor}
        size={sizeMap[size]}
        animate={animate}
      />
    </div>
  )
}
