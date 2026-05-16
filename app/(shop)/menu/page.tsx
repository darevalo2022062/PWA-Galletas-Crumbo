'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const CATEGORIES = ['Todas', 'Clásicas', 'Rellenas', 'Especiales', 'Sin gluten']

const PRODUCTS = [
  { id: '1', name: 'Choco Suprema', category: 'Clásicas', base_price: 38, emoji: '🍫', description: 'Galleta de chocolate con chips', is_daily_special: false },
  { id: '2', name: 'Red Velvet Dream', category: 'Especiales', base_price: 42, emoji: '❤️', description: 'Terciopelo rojo con frosting de queso crema', is_daily_special: true },
  { id: '3', name: 'Vainilla & Sprinkles', category: 'Clásicas', base_price: 35, emoji: '🌈', description: 'Vainilla suave con sprinkles de colores', is_daily_special: false },
  { id: '4', name: 'Mantequilla Clásica', category: 'Clásicas', base_price: 32, emoji: '🧈', description: 'Receta tradicional de mantequilla', is_daily_special: false },
  { id: '5', name: 'Oreo & Crema', category: 'Rellenas', base_price: 45, emoji: '🖤', description: 'Galleta de Oreo rellena de crema', is_daily_special: false },
  { id: '6', name: 'Frambuesa Love', category: 'Rellenas', base_price: 44, emoji: '💗', description: 'Rellena de mermelada de frambuesa artesanal', is_daily_special: true },
  { id: '7', name: 'Limón Burst', category: 'Especiales', base_price: 38, emoji: '🍋', description: 'Galleta de limón con glaseado cítrico', is_daily_special: false },
  { id: '8', name: 'Sin Gluten Choco', category: 'Sin gluten', base_price: 48, emoji: '🌾', description: 'Libre de gluten, sin sacrificar sabor', is_daily_special: false },
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Todas')

  const filtered = activeCategory === 'Todas'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-4xl font-bold text-cafe mb-1">Nuestro menú</h1>
        <p className="text-cafe-medio text-sm mb-6">Galletas artesanales hechas con amor 🍪</p>
      </motion.div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-cafe text-crema'
                : 'bg-gris-suave text-cafe-medio hover:bg-dorado/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
          >
            <Link href={`/producto/${product.id}`}>
              <div className="aspect-square bg-gris-suave flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {product.emoji}
              </div>
              <div className="p-4">
                {product.is_daily_special && (
                  <span className="text-xs font-medium px-2 py-0.5 bg-rosa/10 text-rosa rounded-full">
                    ✨ Especial del día
                  </span>
                )}
                <h3 className="font-medium text-cafe mt-1 text-sm leading-tight">{product.name}</h3>
                <p className="text-cafe-medio text-xs mt-0.5 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-dorado">{formatPrice(product.base_price)}</span>
                  <span className="text-xs text-cafe-medio bg-gris-suave rounded-full px-2 py-0.5">por unidad</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Banner personalizar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-cafe rounded-3xl p-8 text-crema text-center"
      >
        <span className="text-5xl block mb-3">🎨</span>
        <h2 className="font-display text-2xl font-bold mb-2">¿Querés algo único?</h2>
        <p className="text-crema/80 mb-6">Personaliza tu galleta con sabores, rellenos y toppings a tu gusto</p>
        <Link href="/personalizar"
          className="px-6 py-3 bg-dorado text-cafe font-bold rounded-full hover:bg-dorado-claro transition-colors inline-block">
          Personalizar ahora
        </Link>
      </motion.div>
    </div>
  )
}
