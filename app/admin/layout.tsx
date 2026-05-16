import Link from 'next/link'

const navLinks = [
  { href: '/admin/pedidos', label: 'Pedidos', emoji: '📋' },
  { href: '/admin/productos', label: 'Productos', emoji: '🍪' },
  { href: '/admin/configuracion', label: 'Config', emoji: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a0e06] text-crema flex">
      <aside className="w-56 border-r border-white/10 p-6 flex flex-col hidden md:flex">
        <Link href="/admin/pedidos">
          <span className="font-display text-2xl font-bold text-dorado block mb-8">Crumbo Admin</span>
        </Link>
        <nav className="space-y-1">
          {navLinks.map(({ href, label, emoji }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-crema/70 hover:text-crema hover:bg-white/10 transition-colors text-sm font-medium">
              <span>{emoji}</span> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link href="/" className="text-xs text-crema/40 hover:text-crema/70 transition-colors">← Volver a la tienda</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
