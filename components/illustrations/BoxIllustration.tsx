'use client'
import { motion } from 'framer-motion'

export type BoxSize = 'x6' | 'x12' | 'x24'

interface Props {
  boxSize?:     BoxSize
  boxColor?:    string
  ribbonColor?: string
  label?:       string
  animate?:     boolean
  size?:        number
  className?:   string
}

/* ─── Galletas según tamaño ─────────────────────────────────────────
   Las posiciones están en el espacio del plano interior de la caja
   (parallelogram M35,178 L78,112 L268,112 L225,178).
   Ajuste de perspectiva: cada fila sube en y y se desplaza a la derecha. */
const LAYOUTS: Record<BoxSize, { cx: number; cy: number; r: number }[]> = {
  x6: [
    { cx:102, cy:127, r:18 }, { cx:152, cy:127, r:18 }, { cx:202, cy:127, r:18 },
    { cx: 90, cy:160, r:18 }, { cx:140, cy:160, r:18 }, { cx:190, cy:160, r:18 },
  ],
  x12: [
    { cx: 98, cy:120, r:14 }, { cx:136, cy:120, r:14 }, { cx:174, cy:120, r:14 }, { cx:212, cy:120, r:14 },
    { cx: 89, cy:142, r:14 }, { cx:127, cy:142, r:14 }, { cx:165, cy:142, r:14 }, { cx:203, cy:142, r:14 },
    { cx: 82, cy:163, r:14 }, { cx:118, cy:163, r:14 }, { cx:155, cy:163, r:14 }, { cx:192, cy:163, r:14 },
  ],
  x24: [
    { cx: 90, cy:116, r:10 }, { cx:117, cy:116, r:10 }, { cx:144, cy:116, r:10 }, { cx:171, cy:116, r:10 }, { cx:198, cy:116, r:10 }, { cx:225, cy:116, r:10 },
    { cx: 84, cy:133, r:10 }, { cx:111, cy:133, r:10 }, { cx:138, cy:133, r:10 }, { cx:165, cy:133, r:10 }, { cx:192, cy:133, r:10 }, { cx:219, cy:133, r:10 },
    { cx: 79, cy:149, r:10 }, { cx:105, cy:149, r:10 }, { cx:132, cy:149, r:10 }, { cx:158, cy:149, r:10 }, { cx:185, cy:149, r:10 }, { cx:212, cy:149, r:10 },
    { cx: 74, cy:165, r:10 }, { cx:100, cy:165, r:10 }, { cx:127, cy:165, r:10 }, { cx:153, cy:165, r:10 }, { cx:180, cy:165, r:10 }, { cx:207, cy:165, r:10 },
  ],
}

const BOX_LABELS: Record<BoxSize, string> = {
  x6: '6 galletas', x12: '12 galletas', x24: '24 galletas',
}

export default function BoxIllustration({
  boxSize     = 'x12',
  ribbonColor = '#D4A017',
  label,
  animate     = true,
  size        = 280,
  className   = '',
}: Props) {
  const id      = `bx${boxSize}`
  const cookies = LAYOUTS[boxSize]
  const rl      = shift(ribbonColor, +28, +22, +10)
  const rd      = shift(ribbonColor, -24, -18,  -8)

  /* ── Geometría oblicua (30°, profundidad 43px) ──────────────────
     CARA FRONTAL  : rect  x=35 y=178 w=190 h=72  (borde inferior y=250)
     CARA DERECHA  : M225,178 L268,112 L268,184 L225,250
     INTERIOR TOP  : M35,178  L78,112  L268,112 L225,178  ← cookies aquí
     dx=43, dy=-66 */

  const Wrapper = animate ? motion.div : 'div'
  const anim    = animate
    ? { animate: { y: [0,-8,0] }, transition: { duration:4, repeat:Infinity, ease:'easeInOut' } }
    : {}

  return (
    <Wrapper className={`inline-flex items-center justify-center ${className}`} {...(anim as any)}>
      <svg width={size} height={size} viewBox="0 0 280 280" fill="none"
        style={{ filter:'drop-shadow(0 18px 36px rgba(0,0,0,0.22)) drop-shadow(0 5px 12px rgba(0,0,0,0.14))' }}>
        <defs>
          <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F8F8F8" />
            <stop offset="100%" stopColor="#EBEBEB" />
          </linearGradient>
          <linearGradient id={`${id}-right`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#DCDCDC" />
            <stop offset="100%" stopColor="#CACACA" />
          </linearGradient>
          <linearGradient id={`${id}-rv`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={rd}  />
            <stop offset="48%"  stopColor={rl}  />
            <stop offset="100%" stopColor={rd}  />
          </linearGradient>
          <linearGradient id={`${id}-rh`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={rl}  />
            <stop offset="100%" stopColor={rd}  />
          </linearGradient>
          {/* Clip para galletas dentro de la caja */}
          <clipPath id={`${id}-ic`}>
            <path d="M37,177 L80,111 L268,111 L225,177 Z" />
          </clipPath>
        </defs>

        {/* ── Sombra suelo ── */}
        <ellipse cx="141" cy="257" rx="96" ry="11" fill="rgba(0,0,0,0.14)" />

        {/* ═══════════════════════════════════════════
            INTERIOR DE LA CAJA (plano con galletas)
        ════════════════════════════════════════════ */}
        {/* Fondo interior crema */}
        <path d="M35,178 L78,112 L268,112 L225,178 Z" fill="#FFF5E8" />

        {/* Galletas dentro */}
        <g clipPath={`url(#${id}-ic)`}>
          {cookies.map((c,i) => <Cookie key={i} cx={c.cx} cy={c.cy} r={c.r} />)}
        </g>

        {/* Pared trasera interior (franja oscura en el fondo) */}
        <path d="M78,112 L268,112 L268,120 L78,120 Z" fill="#E8DDD0" opacity="0.6" />

        {/* ═══════════════════════════════════════════
            PAREDES INTERIORES visibles (grosor de caja)
        ════════════════════════════════════════════ */}
        {/* Pared interior frontal (tira superior de la cara frontal) */}
        <path d="M35,178 L78,112 L78,124 L35,190 Z" fill="#E2E2E2" />
        {/* Pared interior lateral derecha */}
        <path d="M225,178 L268,112 L268,124 L225,190 Z" fill="#D8D8D8" />

        {/* ═══════════════════════════════════════════
            CARA DERECHA (exterior)
        ════════════════════════════════════════════ */}
        <path d="M225,178 L268,112 L268,184 L225,250 Z" fill={`url(#${id}-right)`} />
        <path d="M225,178 L268,112 L268,184 L225,250 Z"
          stroke="#C0C0C0" strokeWidth="0.8" fill="none" />

        {/* ═══════════════════════════════════════════
            CARA FRONTAL (exterior) — la más visible
        ════════════════════════════════════════════ */}
        <rect x="35" y="178" width="190" height="72" rx="3"
          fill={`url(#${id}-front)`} />
        <rect x="35" y="178" width="190" height="72" rx="3"
          stroke="#C8C8C8" strokeWidth="0.8" fill="none" />

        {/* Línea de tapa (borde superior cara frontal) */}
        <line x1="35" y1="183" x2="225" y2="183"
          stroke="#BBBBBB" strokeWidth="1.2" />

        {/* ═══════════════════════════════════════════
            LAZO — cara frontal
        ════════════════════════════════════════════ */}
        {/* Franja vertical */}
        <rect x="121" y="178" width="16" height="72"
          fill={`url(#${id}-rv)`} opacity="0.88" />
        {/* Franja horizontal */}
        <rect x="35" y="207" width="190" height="12"
          fill={`url(#${id}-rh)`} opacity="0.88" />
        {/* Continuación lazo en cara derecha */}
        <path d="M225,178 L268,112 L268,124 L225,190 Z"
          fill={rl} opacity="0.3" />
        <path d="M225,207 L268,141 L268,153 L225,219 Z"
          fill={rl} opacity="0.4" />

        {/* ═══════════════════════════════════════════
            MOÑO (sobre el borde superior de la caja)
        ════════════════════════════════════════════ */}
        <Bow cx={129} cy={178} rl={rl} rd={rd} />

        {/* ═══════════════════════════════════════════
            ETIQUETA frontal
        ════════════════════════════════════════════ */}
        <rect x="84" y="222" width="88" height="22" rx="5"
          fill="white" stroke="#DDDDDD" strokeWidth="0.8" />
        <text x="128" y="230" textAnchor="middle" dominantBaseline="middle"
          fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7.5" letterSpacing="2"
          fill="#3D1C02">CRUMBO</text>
        <text x="128" y="239" textAnchor="middle" dominantBaseline="middle"
          fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="7"
          fill="#6B3A1F" opacity="0.85">
          {label ?? BOX_LABELS[boxSize]}
        </text>

        {/* Brillo tapa */}
        <rect x="48" y="181" width="60" height="5" rx="2.5"
          fill="white" opacity="0.55" />
      </svg>
    </Wrapper>
  )
}

/* ─── Galleta dorada simple ───────────────────────────────────────── */
function Cookie({ cx, cy, r }: { cx:number; cy:number; r:number }) {
  const chips = [
    [cx-r*.30, cy-r*.26], [cx+r*.26, cy-r*.10],
    [cx-r*.06, cy+r*.28], [cx+r*.24, cy+r*.20],
    [cx-r*.26, cy+r*.06],
  ]
  return (
    <g>
      <circle cx={cx+1}  cy={cy+2}  r={r}      fill="rgba(0,0,0,0.15)" />
      <circle cx={cx}    cy={cy}    r={r}      fill="#D48B2A" />
      <circle cx={cx}    cy={cy}    r={r*.72}  fill="#E8A040" opacity="0.55" />
      <circle cx={cx}    cy={cy}    r={r}      fill="none" stroke="#A86520" strokeWidth={r*.13} />
      {chips.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={r*.19} fill="#3B1A08" opacity="0.85" />
      ))}
      <ellipse cx={cx-r*.22} cy={cy-r*.28} rx={r*.18} ry={r*.11}
        fill="white" opacity="0.28" />
    </g>
  )
}

/* ─── Moño ─────────────────────────────────────────────────────────── */
function Bow({ cx, cy, rl, rd }: { cx:number; cy:number; rl:string; rd:string }) {
  return (
    <g>
      <path d={`M${cx} ${cy} C${cx-32} ${cy-35} ${cx-52} ${cy-10} ${cx-26} ${cy+8}`}   fill={rl} opacity="0.95" />
      <path d={`M${cx} ${cy} C${cx-24} ${cy-20} ${cx-38} ${cy-6}  ${cx-26} ${cy+8}`}   fill={rd} opacity="0.45" />
      <path d={`M${cx} ${cy} C${cx+32} ${cy-35} ${cx+52} ${cy-10} ${cx+26} ${cy+8}`}   fill={rl} opacity="0.95" />
      <path d={`M${cx} ${cy} C${cx+24} ${cy-20} ${cx+38} ${cy-6}  ${cx+26} ${cy+8}`}   fill={rd} opacity="0.45" />
      <path d={`M${cx-4} ${cy+3} C${cx-16} ${cy+16} ${cx-26} ${cy+10} ${cx-22} ${cy+24}`}
        stroke={rd} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d={`M${cx+4} ${cy+3} C${cx+16} ${cy+16} ${cx+26} ${cy+10} ${cx+22} ${cy+24}`}
        stroke={rd} strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx={cx} cy={cy+1} rx="10" ry="8"  fill={rl} />
      <ellipse cx={cx} cy={cy+1} rx="4.5" ry="3.5" fill={shift(rl, +18,+14,+6)} />
    </g>
  )
}

function shift(hex:string, dr:number, dg:number, db:number):string {
  const n = parseInt(hex.replace('#',''), 16)
  return `rgb(${c((n>>16)+dr)},${c(((n>>8)&0xff)+dg)},${c((n&0xff)+db)})`
}
function c(v:number){ return Math.min(255,Math.max(0,v)) }
