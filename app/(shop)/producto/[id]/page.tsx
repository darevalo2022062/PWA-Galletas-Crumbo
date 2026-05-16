'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const PRODUCT = {
  id: '1',
  name: 'Choco Suprema',
  description: 'Nuestra galleta más amada. Base de chocolate oscuro con chips de chocolate belga, horneada al punto perfecto para ese crujiente exterior y centro suave.',
  base_price: 38,
  emoji: '🍫',
  ingredients: 'Harina de trigo, mantequilla, azúcar morena, cacao, chips de chocolate 60%',
  allergens: 'Gluten, lácteos, huevo',
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  function handleAdd() {
    addItem(
      { ...PRODUCT, category_id: '1', image_url: null, active: true, is_daily_special: false, stock_limit: null },
      quantity,
      []
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/menu" className="text-cafe-medio text-sm hover:text-cafe mb-6 inline-flex items-center gap-1">
        ← Volver al menú
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Imagen del producto */}
        <div className="aspect-square bg-gris-suave rounded-3xl flex items-center justify-center text-8xl mb-6">
          {PRODUCT.emoji}
        </div>

        <h1 className="font-display text-3xl font-bold text-cafe mb-2">{PRODUCT.name}</h1>
        <p className="font-display text-2xl font-bold text-dorado mb-4">{formatPrice(PRODUCT.base_price)}</p>
        <p className="text-cafe-medio mb-6">{PRODUCT.description}</p>

        <div className="bg-gris-suave rounded-2xl p-4 mb-6 space-y-2 text-sm">
          <p><span className="font-medium text-cafe">Ingredientes:</span> <span className="text-cafe-medio">{PRODUCT.ingredients}</span></p>
          <p><span className="font-medium text-cafe">Alérgenos:</span> <span className="text-cafe-medio">{PRODUCT.allergens}</span></p>
        </div>

        {/* Cantidad */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-cafe font-medium">Cantidad</span>
          <div className="flex items-center gap-3 bg-gris-suave rounded-full px-4 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cafe font-bold shadow-sm hover:bg-dorado hover:text-crema transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center font-bold text-cafe">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cafe font-bold shadow-sm hover:bg-dorado hover:text-crema transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
              added ? 'bg-green-500 text-white' : 'bg-cafe text-crema hover:bg-cafe-medio'
            }`}
          >
            {added ? '✓ Agregado al carrito' : `Agregar — ${formatPrice(PRODUCT.base_price * quantity)}`}
          </motion.button>
        </div>

        <div className="mt-4">
          <Link href={`/personalizar?base=${params.id}`}
            className="block w-full text-center py-3.5 border-2 border-cafe text-cafe rounded-2xl font-medium hover:bg-cafe hover:text-crema transition-colors">
            🎨 Personalizar esta galleta
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
