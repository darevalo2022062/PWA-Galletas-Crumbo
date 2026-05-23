'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { CartCustomization } from '@/types'

const CookieScene = dynamic(() => import('@/components/3d/CookieScene'), {
  ssr: false,
  loading: () => <div className="w-20 h-20 bg-gris-suave rounded-full animate-pulse" />,
})

const BASE_PRODUCT = { id: 'custom-cookie', name: 'Galleta Personalizada', base_price: 38, category_id: 'custom', image_url: null, active: true, is_daily_special: false, stock_limit: null, description: null }
const MIN_COOKIES = 6

const OPTIONS = {
  flavor: [
    { id: 'f1', label: 'Chocolate oscuro', extra_price: 0, color: '#3B1A08', type: 'flavor' as const },
    { id: 'f2', label: 'Vainilla', extra_price: 0, color: '#F5E6C8', type: 'flavor' as const },
    { id: 'f3', label: 'Red Velvet', extra_price: 5, color: '#8B0000', type: 'flavor' as const },
    { id: 'f4', label: 'Limón', extra_price: 3, color: '#F4D03F', type: 'flavor' as const },
  ],
  filling: [
    { id: 'fi1', label: 'Sin relleno', extra_price: 0, color: '#FAF3E0', type: 'filling' as const },
    { id: 'fi2', label: 'Nutella', extra_price: 8, color: '#6B3A1F', type: 'filling' as const },
    { id: 'fi3', label: 'Crema de vainilla', extra_price: 6, color: '#FFF8E7', type: 'filling' as const },
    { id: 'fi4', label: 'Mermelada de frambuesa', extra_price: 7, color: '#C0392B', type: 'filling' as const },
  ],
  topping: [
    { id: 't1', label: 'Chips de chocolate', extra_price: 4, color: '#3B1A08', type: 'topping' as const },
    { id: 't2', label: 'Sprinkles', extra_price: 3, color: '#E74C3C', type: 'topping' as const },
    { id: 't3', label: 'Nueces', extra_price: 5, color: '#D4A017', type: 'topping' as const },
    { id: 't4', label: 'Coco rallado', extra_price: 4, color: '#F5F5F5', type: 'topping' as const },
  ],
  presentation: [
    { id: 'p1', label: 'Sencilla', extra_price: 0, color: '#FAF3E0', type: 'presentation' as const },
    { id: 'p2', label: 'Con glaseado', extra_price: 6, color: '#FFFFFF', type: 'presentation' as const },
    { id: 'p3', label: 'Decorada festiva', extra_price: 10, color: '#E8596A', type: 'presentation' as const },
  ],
}

type OptionKey = keyof typeof OPTIONS

const STEP_LABELS: { key: OptionKey; label: string; emoji: string }[] = [
  { key: 'flavor',       label: 'Sabor',        emoji: '🍫' },
  { key: 'filling',      label: 'Relleno',       emoji: '🎁' },
  { key: 'topping',      label: 'Topping',       emoji: '✨' },
  { key: 'presentation', label: 'Presentación',  emoji: '🎀' },
]

export default function PersonalizarPage() {
  const router  = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [step,       setStep]       = useState(0)
  const [selected,   setSelected]   = useState<Record<OptionKey, string>>({
    flavor: 'f1', filling: 'fi1', topping: 't1', presentation: 'p1',
  })
  const [quantity,   setQuantity]   = useState(MIN_COOKIES)
  const [dedication, setDedication] = useState('')
  const [added,      setAdded]      = useState(false)

  const currentStep   = STEP_LABELS[step]
  const currentOptions = OPTIONS[currentStep.key]

  const selectedFlavor  = OPTIONS.flavor.find((o) => o.id === selected.flavor)
  const selectedTopping = OPTIONS.topping.find((o) => o.id === selected.topping)

  const extraTotal = Object.entries(selected).reduce((sum, [key, id]) => {
    const option = OPTIONS[key as OptionKey].find((o) => o.id === id)
    return sum + (option?.extra_price ?? 0)
  }, 0)

  const unitPrice  = BASE_PRODUCT.base_price + extraTotal
  const totalPrice = unitPrice * quantity

  function getCustomizations(): CartCustomization[] {
    return Object.entries(selected).map(([key, id]) => {
      const option = OPTIONS[key as OptionKey].find((o) => o.id === id)!
      return { option_id: option.id, type: option.type, label: option.label, extra_price: option.extra_price }
    })
  }

  function handleAdd() {
    addItem(BASE_PRODUCT, quantity, getCustomizations(), dedication || undefined)
    setAdded(true)
    setTimeout(() => router.push('/carrito'), 1200)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-28">

      {/* ── Header ── */}
      <div className="mb-4">
        <h1 className="font-display text-xl font-bold text-cafe leading-tight">Crear mi galleta 🎨</h1>
        <p className="text-cafe-medio text-xs">Mínimo {MIN_COOKIES} galletas · personalización única</p>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: columna única  |  DESKTOP: 2 cols
      ══════════════════════════════════════════ */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 md:items-start gap-4">

        {/* ── Vista previa — compacta en mobile ── */}
        <div className="md:sticky md:top-24">
          <div className="bg-gradient-to-b from-cafe to-cafe-medio rounded-2xl p-3 md:p-6 flex items-center gap-4 md:flex-col md:gap-0">
            {/* Galleta pequeña en mobile, grande en desktop */}
            <div className="shrink-0 md:w-full">
              <CookieScene
                cookieColor={selectedFlavor?.color}
                toppingColor={selectedTopping?.color}
                chipColor={selectedTopping?.color}
                size="sm"
                className="md:hidden"
                animate={false}
              />
              <CookieScene
                cookieColor={selectedFlavor?.color}
                toppingColor={selectedTopping?.color}
                chipColor={selectedTopping?.color}
                size="lg"
                className="hidden md:flex"
              />
            </div>

            {/* Precio + resumen al lado en mobile */}
            <div className="flex-1 md:mt-4 md:text-center md:w-full">
              <p className="font-display text-xl md:text-2xl font-bold text-dorado">{formatPrice(unitPrice)}</p>
              <p className="text-crema/60 text-xs">por galleta · total {formatPrice(totalPrice)}</p>

              {/* Resumen selección — solo visible en mobile aquí, en desktop abajo */}
              <div className="mt-2 space-y-0.5 md:hidden">
                {STEP_LABELS.map(({ key, label, emoji }) => {
                  const opt = OPTIONS[key].find((o) => o.id === selected[key])
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-crema/50">{emoji} {label}</span>
                      <span className="text-crema/80 font-medium truncate ml-2 max-w-[120px]">{opt?.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Resumen desktop (debajo de la galleta) */}
          <div className="hidden md:block mt-4 bg-gris-suave rounded-2xl p-4 space-y-2">
            {STEP_LABELS.map(({ key, label, emoji }) => {
              const opt = OPTIONS[key].find((o) => o.id === selected[key])
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-cafe-medio">{emoji} {label}</span>
                  <span className="font-medium text-cafe">
                    {opt?.label}
                    {opt && opt.extra_price > 0 && <span className="text-dorado ml-1">+{formatPrice(opt.extra_price)}</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Panel de opciones ── */}
        <div>
          {/* Tabs de pasos — scroll horizontal */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {STEP_LABELS.map(({ key, label, emoji }, i) => (
              <button
                key={key}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  step === i ? 'bg-cafe text-crema' : 'bg-gris-suave text-cafe-medio hover:bg-dorado/10'
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Opciones — 2 columnas compactas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 gap-2 mb-4"
            >
              {currentOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected((s) => ({ ...s, [currentStep.key]: opt.id }))}
                  className={`p-3 rounded-xl text-left border-2 transition-all ${
                    selected[currentStep.key] === opt.id
                      ? 'border-cafe bg-cafe/5'
                      : 'border-transparent bg-gris-suave hover:border-dorado/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-lg shrink-0 border border-black/5"
                      style={{ backgroundColor: opt.color }} />
                    <p className="font-medium text-cafe text-xs leading-tight">{opt.label}</p>
                  </div>
                  {opt.extra_price > 0
                    ? <p className="text-dorado text-xs font-medium">+{formatPrice(opt.extra_price)}</p>
                    : <p className="text-cafe-medio text-xs">Incluido</p>}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navegación pasos */}
          <div className="flex gap-2 mb-4">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 rounded-full border-2 border-cafe text-cafe text-xs font-medium">
                ← Anterior
              </button>
            )}
            {step < STEP_LABELS.length - 1 && (
              <button onClick={() => setStep(step + 1)}
                className="px-3 py-1.5 rounded-full bg-cafe text-crema text-xs font-medium ml-auto">
                Siguiente →
              </button>
            )}
          </div>

          {/* Cantidad */}
          <div className="bg-gris-suave rounded-xl p-3 mb-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-cafe text-sm">Cantidad</p>
              <p className="text-cafe-medio text-xs">Mínimo {MIN_COOKIES}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(MIN_COOKIES, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cafe font-bold shadow-sm hover:bg-dorado hover:text-crema transition-colors text-lg"
              >−</button>
              <span className="font-display text-xl font-bold text-cafe w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cafe font-bold shadow-sm hover:bg-dorado hover:text-crema transition-colors text-lg"
              >+</button>
            </div>
          </div>

          {/* Dedicatoria */}
          <div className="bg-gris-suave rounded-xl p-3 mb-4">
            <p className="font-medium text-cafe text-sm mb-1.5">
              Mensaje <span className="text-cafe-medio font-normal text-xs">(opcional)</span>
            </p>
            <textarea
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="Ej: ¡Feliz cumpleaños amor! 🎂"
              className="w-full bg-white rounded-lg px-3 py-2 text-cafe text-sm outline-none resize-none border border-dorado/10 focus:border-dorado/40"
              rows={2}
              maxLength={100}
            />
            <p className="text-xs text-cafe-medio text-right">{dedication.length}/100</p>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleAdd}
            disabled={added}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg ${
              added ? 'bg-green-500 text-white' : 'bg-cafe text-crema hover:bg-cafe-medio'
            }`}
          >
            {added ? '✓ ¡Agregado!' : `Agregar al carrito — ${formatPrice(totalPrice)}`}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
