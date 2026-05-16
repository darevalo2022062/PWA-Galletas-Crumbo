'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    min_cookies: 6,
    delivery_fee: 20,
    estimated_minutes: 55,
    store_open: true,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="font-display text-2xl font-bold text-crema mb-8">Configuración</h1>

      <div className="space-y-5">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-medium text-crema">Tienda abierta</h2>
            <button onClick={() => setConfig((c) => ({ ...c, store_open: !c.store_open }))}
              className={`w-12 h-6 rounded-full relative transition-colors ${config.store_open ? 'bg-dorado' : 'bg-white/20'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${config.store_open ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-crema/40 text-sm">{config.store_open ? 'Recibiendo pedidos' : 'Cerrado — no se pueden hacer pedidos'}</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="font-medium text-crema mb-3">Mínimo de galletas para personalización</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setConfig((c) => ({ ...c, min_cookies: Math.max(1, c.min_cookies - 1) }))}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-crema font-bold hover:bg-dorado hover:text-cafe transition-colors">−</button>
            <span className="font-display text-3xl font-bold text-dorado w-8 text-center">{config.min_cookies}</span>
            <button onClick={() => setConfig((c) => ({ ...c, min_cookies: c.min_cookies + 1 }))}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-crema font-bold hover:bg-dorado hover:text-cafe transition-colors">+</button>
            <span className="text-crema/40 text-sm">galletas</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="font-medium text-crema mb-3">Costo de envío (Q)</h2>
          <input
            type="number"
            value={config.delivery_fee}
            onChange={(e) => setConfig((c) => ({ ...c, delivery_fee: Number(e.target.value) }))}
            className="bg-white/10 rounded-xl px-4 py-2.5 text-crema outline-none w-32 text-center font-bold"
          />
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h2 className="font-medium text-crema mb-3">Tiempo estimado de entrega (minutos)</h2>
          <input
            type="number"
            value={config.estimated_minutes}
            onChange={(e) => setConfig((c) => ({ ...c, estimated_minutes: Number(e.target.value) }))}
            className="bg-white/10 rounded-xl px-4 py-2.5 text-crema outline-none w-32 text-center font-bold"
          />
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3.5 rounded-2xl font-bold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-dorado text-cafe hover:bg-dorado-claro'}`}
        >
          {saved ? '✓ Configuración guardada' : 'Guardar cambios'}
        </motion.button>
      </div>
    </div>
  )
}
