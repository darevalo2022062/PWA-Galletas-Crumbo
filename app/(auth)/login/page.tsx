'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/user'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits.startsWith('502') && digits.length > 0) {
      return '+502' + digits
    }
    return '+' + digits
  }

  async function sendOTP() {
    setLoading(true)
    setError('')
    const formattedPhone = formatPhone(phone)
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
    if (error) {
      setError('No pudimos enviar el código. Verifica tu número.')
    } else {
      setStep('otp')
    }
    setLoading(false)
  }

  async function verifyOTP() {
    setLoading(true)
    setError('')
    const formattedPhone = formatPhone(phone)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: 'sms',
    })
    if (error || !data.user) {
      setError('Código incorrecto. Intenta de nuevo.')
      setLoading(false)
      return
    }
    // Check if user has name
    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('id', data.user.id)
      .single()

    if (!userData?.name) {
      setStep('name')
    } else {
      setUser({ id: data.user.id, phone: formattedPhone, name: userData.name, created_at: data.user.created_at })
      router.push('/')
    }
    setLoading(false)
  }

  async function saveName() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('users').upsert({ id: user.id, phone: formatPhone(phone), name })
    setUser({ id: user.id, phone: formatPhone(phone), name, created_at: user.created_at })
    router.push('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cafe flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="block text-center font-display text-4xl font-bold text-dorado mb-8">
          Crumbo
        </Link>

        <div className="bg-crema rounded-3xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-2xl font-bold text-cafe mb-2">¡Hola! 👋</h1>
                <p className="text-cafe-medio text-sm mb-6">Ingresa tu número para continuar</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-cafe-medio mb-1 block">Teléfono (Guatemala)</label>
                    <div className="flex items-center bg-gris-suave rounded-2xl overflow-hidden">
                      <span className="px-3 text-cafe-medio text-sm font-medium border-r border-dorado/20 py-3">🇬🇹 +502</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                        placeholder="5555-5555"
                        className="flex-1 bg-transparent px-3 py-3 text-cafe outline-none placeholder-cafe-medio/50"
                        maxLength={8}
                      />
                    </div>
                  </div>
                  {error && <p className="text-rosa text-sm">{error}</p>}
                  <button
                    onClick={sendOTP}
                    disabled={phone.length < 8 || loading}
                    className="w-full py-3.5 bg-cafe text-crema rounded-2xl font-semibold disabled:opacity-50 hover:bg-cafe-medio transition-colors"
                  >
                    {loading ? 'Enviando...' : 'Recibir código'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-2xl font-bold text-cafe mb-2">Código 🔑</h1>
                <p className="text-cafe-medio text-sm mb-6">
                  Enviamos un código a +502 {phone}
                </p>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={code}
                    onChange={(e) => setCode(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-gris-suave rounded-2xl py-4 text-cafe outline-none"
                    maxLength={6}
                  />
                  {error && <p className="text-rosa text-sm">{error}</p>}
                  <button
                    onClick={verifyOTP}
                    disabled={code.length < 6 || loading}
                    className="w-full py-3.5 bg-cafe text-crema rounded-2xl font-semibold disabled:opacity-50 hover:bg-cafe-medio transition-colors"
                  >
                    {loading ? 'Verificando...' : 'Ingresar'}
                  </button>
                  <button onClick={() => setStep('phone')} className="w-full text-cafe-medio text-sm hover:text-cafe">
                    Cambiar número
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'name' && (
              <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-2xl font-bold text-cafe mb-2">¿Cómo te llamás? 😊</h1>
                <p className="text-cafe-medio text-sm mb-6">Solo para personalizar tu experiencia</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-gris-suave rounded-2xl px-4 py-3.5 text-cafe outline-none placeholder-cafe-medio/50"
                  />
                  <button
                    onClick={saveName}
                    disabled={name.trim().length < 2 || loading}
                    className="w-full py-3.5 bg-cafe text-crema rounded-2xl font-semibold disabled:opacity-50 hover:bg-cafe-medio transition-colors"
                  >
                    {loading ? 'Guardando...' : '¡Listo, quiero galletas! 🍪'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
