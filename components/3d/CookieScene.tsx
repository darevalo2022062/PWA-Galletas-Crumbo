'use client'
import { useRef, useEffect, useCallback } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'

interface Props {
  cookieColor?: string
  toppingColor?: string
  hasChips?: boolean
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-40', md: 'h-64', lg: 'h-72 md:h-80' }

const TOPPING_OBJECTS = ['Topping_ChocolateChips', 'Topping_Sprinkles']

function makeTransparent(spline: any) {
  try {
    if (spline._renderer) {
      spline._renderer.setClearColor(0x000000, 0)
      spline._renderer.setClearAlpha(0)
    }
    if (spline._scene) {
      spline._scene.background = null
    }
    // Force a re-render so the clear takes effect
    if (spline._renderer && spline._scene && spline._camera) {
      spline._renderer.render(spline._scene, spline._camera)
    }
  } catch (_) {}
}

export default function CookieScene({
  cookieColor,
  toppingColor,
  hasChips = true,
  interactive = false,
  size = 'lg',
}: Props) {
  const splineRef = useRef<Application | null>(null)

  const applyState = useCallback((spline: Application) => {
    makeTransparent(spline)

    const base = (spline as any).findObjectByName?.('CookieBase')
    if (base && cookieColor) {
      try { base.material?.color?.set?.(cookieColor) } catch (_) {}
    }

    TOPPING_OBJECTS.forEach((name) => {
      const obj = (spline as any).findObjectByName?.(name)
      if (obj) obj.visible = false
    })

    if (hasChips) {
      const chips = (spline as any).findObjectByName?.('Topping_ChocolateChips')
      if (chips) chips.visible = true
    }
  }, [cookieColor, hasChips])

  useEffect(() => {
    if (splineRef.current) applyState(splineRef.current)
  }, [applyState])

  function onLoad(spline: Application) {
    splineRef.current = spline
    applyState(spline)
    // Re-apply after a frame to catch late renders
    requestAnimationFrame(() => makeTransparent(spline))
  }

  return (
    <div
      className={`w-full ${sizeMap[size]} ${interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      style={{ background: 'transparent' }}
    >
      <Spline
        scene="https://prod.spline.design/uxkDe7IY2jhfRg-B/scene.splinecode"
        onLoad={onLoad}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />
    </div>
  )
}
