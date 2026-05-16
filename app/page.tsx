'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'

const CookieScene = dynamic(() => import('@/components/3d/CookieScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-dorado/20 animate-pulse" />
    </div>
  ),
})

const STEPS = [
  { icon: '🎨', title: 'Elige tu galleta', desc: 'Selecciona entre nuestras bases artesanales' },
  { icon: '✨', title: 'Personaliza', desc: 'Sabores, rellenos, toppings y presentación' },
  { icon: '📦', title: 'Recibe en casa', desc: 'Entrega directa en Guatemala' },
]

const FEATURED = [
  { name: 'Choco Suprema', price: 'Q38.00', emoji: '🍫', tag: 'Más vendida' },
  { name: 'Red Velvet Dream', price: 'Q42.00', emoji: '❤️', tag: 'Especial del día' },
  { name: 'Vainilla & Sprinkles', price: 'Q35.00', emoji: '🌈', tag: null },
  { name: 'Mantequilla Clásica', price: 'Q32.00', emoji: '🧈', tag: null },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cafe to-cafe-medio text-crema">
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute select-none"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: '110vh', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 7 + (i % 4), delay: i * 0.5, repeat: Infinity, ease: 'linear' }}
                style={{ left: `${(i * 10) % 100}%`, fontSize: `${16 + (i % 3) * 8}px` }}
              >
                {['🍪', '✨', '🍫', '🌟'][i % 4]}
              </motion.div>
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-6 grid md:grid-cols-2 items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center md:text-left"
            >
              <span className="inline-block px-3 py-1 bg-dorado/20 text-dorado-claro text-xs font-semibold rounded-full mb-3">
                🇬🇹 Hecho en Guatemala
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-3">
                Galletas que
                <br />
                <span className="text-dorado">enamoran</span>
              </h1>
              <p className="text-crema/80 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
                Personaliza cada detalle. Cada galleta es una obra de arte hecha solo para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/menu"
                  className="px-7 py-3 bg-dorado text-cafe font-bold rounded-full text-base hover:bg-dorado-claro transition-colors shadow-lg">
                  Pedir ahora
                </Link>
                <Link href="/personalizar"
                  className="px-7 py-3 bg-transparent border-2 border-crema/40 text-crema rounded-full text-base hover:border-dorado hover:text-dorado transition-colors">
                  Personalizar 🎨
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <CookieScene size="lg" />
            </motion.div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-10 md:py-16 px-4 bg-gris-suave">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-cafe text-center mb-8 md:mb-12"
            >
              Así de fácil
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 sm:text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 mx-auto bg-dorado/10 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl sm:mb-4 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <div className="w-6 h-6 bg-dorado rounded-full mb-2 flex items-center justify-center text-cafe text-xs font-bold hidden sm:flex mx-auto">
                      {i + 1}
                    </div>
                    <h3 className="font-semibold text-cafe text-base mb-1">{step.title}</h3>
                    <p className="text-cafe-medio text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos populares */}
        <section className="py-10 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-2xl md:text-3xl font-bold text-cafe"
              >
                Las favoritas
              </motion.h2>
              <Link href="/menu" className="text-dorado text-sm font-semibold hover:underline">
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {FEATURED.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-3 md:p-4 shadow-sm cursor-pointer group"
                >
                  <Link href="/menu">
                    <div className="aspect-square bg-gris-suave rounded-2xl flex items-center justify-center text-4xl md:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </div>
                    {item.tag && (
                      <span className="text-xs font-medium px-2 py-0.5 bg-rosa/10 text-rosa rounded-full">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="font-semibold text-cafe mt-1 text-sm leading-tight">{item.name}</h3>
                    <p className="font-bold text-dorado text-sm">{item.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA cajas */}
        <section className="py-10 md:py-16 px-4 bg-cafe text-crema">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-5xl block mb-3">📦</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Regala una experiencia
              </h2>
              <p className="text-crema/80 mb-6 max-w-sm mx-auto text-sm md:text-base">
                Cajas personalizadas con lazo, tarjeta y galletas a tu elección. El regalo perfecto para cualquier ocasión.
              </p>
              <Link href="/cajas"
                className="px-7 py-3 bg-dorado text-cafe font-bold rounded-full text-base hover:bg-dorado-claro transition-colors inline-block">
                Armar mi caja
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <BottomNav />
    </>
  )
}
