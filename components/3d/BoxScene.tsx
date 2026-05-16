'use client'
import { useRef, useEffect, useCallback } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'

interface Props {
  color?: string
  ribbonColor?: string
  open?: boolean
  interactive?: boolean
}

const RIBBON_OBJECTS = ['Knot', 'Big Knot', 'Knotball', 'Decoration']

function makeTransparent(spline: any) {
  try {
    if (spline._renderer) {
      spline._renderer.setClearColor(0x000000, 0)
      spline._renderer.setClearAlpha(0)
    }
    if (spline._scene) {
      spline._scene.background = null
    }
    if (spline._renderer && spline._scene && spline._camera) {
      spline._renderer.render(spline._scene, spline._camera)
    }
  } catch (_) {}
}

export default function BoxScene({
  color,
  ribbonColor,
  open = false,
  interactive = false,
}: Props) {
  const splineRef = useRef<Application | null>(null)

  const applyState = useCallback((spline: Application) => {
    makeTransparent(spline)

    const box = (spline as any).findObjectByName?.('Box')
    if (box && color) {
      try { box.material?.color?.set?.(color) } catch (_) {}
    }

    const wrapper = (spline as any).findObjectByName?.('Wrapper')
    if (wrapper && color) {
      try { wrapper.material?.color?.set?.(color) } catch (_) {}
    }

    if (ribbonColor) {
      RIBBON_OBJECTS.forEach((name) => {
        const obj = (spline as any).findObjectByName?.(name)
        try { if (obj) obj.material?.color?.set?.(ribbonColor) } catch (_) {}
      })
    }
  }, [color, ribbonColor, open])

  useEffect(() => {
    if (splineRef.current) applyState(splineRef.current)
  }, [applyState])

  function onLoad(spline: Application) {
    splineRef.current = spline
    applyState(spline)
    requestAnimationFrame(() => makeTransparent(spline))
  }

  return (
    <div
      className={`w-full h-64 md:h-72 ${interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      style={{ background: 'transparent' }}
    >
      <Spline
        scene="https://prod.spline.design/qsPQQX687EDbWJu2/scene.splinecode"
        onLoad={onLoad}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />
    </div>
  )
}
