'use client'
import { motion } from 'framer-motion'

interface Props {
  baseColor?: string
  frostingColor?: string
  chipColor?: string
  size?: number
  animate?: boolean
  className?: string
}

// Positions for chips — hand-tuned to look natural
const CHIPS = [
  { cx: 112, cy: 82,  rx: 9,  ry: 7.5, rot: -18 },
  { cx: 148, cy: 72,  rx: 8.5,ry: 7,   rot: 12  },
  { cx: 174, cy: 96,  rx: 9,  ry: 7.5, rot: -8  },
  { cx: 162, cy: 128, rx: 9,  ry: 7.5, rot: 20  },
  { cx: 128, cy: 140, rx: 8,  ry: 6.5, rot: -5  },
  { cx: 96,  cy: 118, rx: 9,  ry: 7.5, rot: 15  },
  { cx: 104, cy: 152, rx: 8,  ry: 6.5, rot: -22 },
  { cx: 148, cy: 160, rx: 8.5,ry: 7,   rot: 8   },
  { cx: 178, cy: 148, rx: 7.5,ry: 6,   rot: -14 },
  { cx: 84,  cy: 152, rx: 7,  ry: 5.5, rot: 18  },
  { cx: 136, cy: 104, rx: 7.5,ry: 6,   rot: -10 },
]

export default function CookieIllustration({
  baseColor = '#C8852A',
  frostingColor,
  chipColor = '#2C1208',
  size = 260,
  animate = true,
  className = '',
}: Props) {
  const id = `ck-${Math.abs(baseColor.charCodeAt(1) + baseColor.charCodeAt(2))}`

  // Derive color stops from base
  const light   = shiftColor(baseColor,  +38, +28, +12)
  const mid     = shiftColor(baseColor,  +12,  +8,  +2)
  const dark    = shiftColor(baseColor,  -22, -18, -10)
  const edge    = shiftColor(baseColor,  -40, -32, -20)
  const chipHi  = shiftColor(chipColor,  +28, +20, +14)
  const chipSh  = shiftColor(chipColor,  -10,  -8,  -5)

  const Wrapper = animate ? motion.div : 'div'
  const anim = animate
    ? { animate: { y: [0, -9, 0], rotate: [0, 1.2, -1.2, 0] }, transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }
    : {}

  return (
    <Wrapper className={`inline-flex items-center justify-center ${className}`} {...(anim as any)}>
      <svg width={size} height={size} viewBox="0 0 260 260" fill="none"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(61,28,2,0.32)) drop-shadow(0 6px 12px rgba(61,28,2,0.22))' }}>
        <defs>
          {/* Main cookie gradient — dome effect */}
          <radialGradient id={`${id}-dome`} cx="40%" cy="35%" r="68%">
            <stop offset="0%"   stopColor={light} />
            <stop offset="30%"  stopColor={mid} />
            <stop offset="72%"  stopColor={baseColor} />
            <stop offset="100%" stopColor={dark} />
          </radialGradient>
          {/* Edge darkening ring */}
          <radialGradient id={`${id}-crust`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="88%" stopColor={dark} stopOpacity="0.35" />
            <stop offset="100%" stopColor={edge} stopOpacity="0.7" />
          </radialGradient>
          {/* Subtle texture overlay */}
          <radialGradient id={`${id}-tex`} cx="55%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {/* Chip shadow */}
          <filter id={`${id}-chip-shadow`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={chipSh} floodOpacity="0.7" />
          </filter>
        </defs>

        {/* ── Cookie base shape (slightly organic) ── */}
        <path
          d="M130 22
             C154 21 175 27 193 40
             C213 55 228 76 232 100
             C237 127 230 156 215 175
             C198 196 172 210 146 216
             C120 222  94 218  72 206
             C50  194  33 173  26 148
             C18  122  21  93  34  70
             C47   47  68  30  92  24
             C104  21 117  22 130  22 Z"
          fill={`url(#${id}-dome)`}
        />

        {/* Crust ring darkening */}
        <path
          d="M130 22
             C154 21 175 27 193 40
             C213 55 228 76 232 100
             C237 127 230 156 215 175
             C198 196 172 210 146 216
             C120 222  94 218  72 206
             C50  194  33 173  26 148
             C18  122  21  93  34  70
             C47   47  68  30  92  24
             C104  21 117  22 130  22 Z"
          fill={`url(#${id}-crust)`}
        />

        {/* Surface texture highlight */}
        <path
          d="M130 22
             C154 21 175 27 193 40
             C213 55 228 76 232 100
             C237 127 230 156 215 175
             C198 196 172 210 146 216
             C120 222  94 218  72 206
             C50  194  33 173  26 148
             C18  122  21  93  34  70
             C47   47  68  30  92  24
             C104  21 117  22 130  22 Z"
          fill={`url(#${id}-tex)`}
        />

        {/* ── Crack / texture lines ── */}
        <CrackLines baseColor={baseColor} dark={dark} />

        {/* ── Chocolate chips ── */}
        {CHIPS.map((c, i) => (
          <Chip key={i} {...c} chipColor={chipColor} chipHi={chipHi} chipSh={chipSh} filterId={`${id}-chip-shadow`} />
        ))}

        {/* ── Specular highlight (dome gloss) ── */}
        <ellipse cx="104" cy="76" rx="26" ry="14" fill="white" opacity="0.10" transform="rotate(-28 104 76)" />
      </svg>
    </Wrapper>
  )
}

function CrackLines({ baseColor, dark }: { baseColor: string; dark: string }) {
  const s = (o: number) => ({ stroke: dark, strokeWidth: 1.2, strokeLinecap: 'round' as const, opacity: o, fill: 'none' })
  return (
    <g>
      <path d="M118 62 Q112 74 118 86 Q124 96 116 106" {...s(0.28)} />
      <path d="M152 68 Q160 80 154 92" {...s(0.22)} />
      <path d="M176 110 Q168 120 174 132" {...s(0.20)} />
      <path d="M96 132 Q102 142 98 154" {...s(0.22)} />
      <path d="M138 164 Q144 174 140 184" {...s(0.18)} />
      <path d="M78 96 Q88 104 82 116" {...s(0.20)} />
      <path d="M160 170 Q166 178 162 186" {...s(0.16)} />
      <path d="M120 104 Q128 110 122 120" {...s(0.18)} />
      <path d="M158 108 Q150 116 156 126" {...s(0.18)} />
    </g>
  )
}

function Chip({ cx, cy, rx, ry, rot, chipColor, chipHi, chipSh, filterId }: {
  cx: number; cy: number; rx: number; ry: number; rot: number
  chipColor: string; chipHi: string; chipSh: string; filterId: string
}) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      {/* Shadow blob */}
      <ellipse cx={cx + 1} cy={cy + ry * 0.6 + 1} rx={rx * 0.88} ry={ry * 0.45} fill={chipSh} opacity="0.55" />
      {/* Main chip body */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={chipColor} filter={`url(#${filterId})`} />
      {/* Subtle top bump */}
      <ellipse cx={cx} cy={cy - ry * 0.18} rx={rx * 0.75} ry={ry * 0.6} fill={shiftColor(chipColor, +10, +8, +5)} opacity="0.4" />
      {/* Highlight */}
      <ellipse cx={cx - rx * 0.3} cy={cy - ry * 0.28} rx={rx * 0.28} ry={ry * 0.2} fill={chipHi} opacity="0.55" />
    </g>
  )
}

function shiftColor(hex: string, dr: number, dg: number, db: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + dr))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + dg))
  const b = Math.min(255, Math.max(0, (n & 0xff) + db))
  return `rgb(${r},${g},${b})`
}
